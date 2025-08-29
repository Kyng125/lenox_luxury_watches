-- Create function to safely reduce product stock
CREATE OR REPLACE FUNCTION reduce_product_stock(product_id UUID, quantity_to_reduce INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET stock_quantity = GREATEST(0, stock_quantity - quantity_to_reduce),
      updated_at = NOW()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increase product stock (for returns/restocking)
CREATE OR REPLACE FUNCTION increase_product_stock(product_id UUID, quantity_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET stock_quantity = stock_quantity + quantity_to_add,
      updated_at = NOW()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Create inventory movements table for tracking stock changes
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) CHECK (movement_type IN ('sale', 'restock', 'adjustment', 'return')),
  quantity_change INTEGER NOT NULL, -- Positive for increases, negative for decreases
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reference_id UUID, -- Order ID, restock ID, etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create index for inventory movements
CREATE INDEX idx_inventory_movements_product_id ON inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(movement_type);
CREATE INDEX idx_inventory_movements_created_at ON inventory_movements(created_at);

-- Create function to log inventory movements
CREATE OR REPLACE FUNCTION log_inventory_movement(
  p_product_id UUID,
  p_movement_type VARCHAR(20),
  p_quantity_change INTEGER,
  p_previous_quantity INTEGER,
  p_new_quantity INTEGER,
  p_reference_id UUID DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO inventory_movements (
    product_id,
    movement_type,
    quantity_change,
    previous_quantity,
    new_quantity,
    reference_id,
    notes,
    created_by
  ) VALUES (
    p_product_id,
    p_movement_type,
    p_quantity_change,
    p_previous_quantity,
    p_new_quantity,
    p_reference_id,
    p_notes,
    p_created_by
  );
END;
$$ LANGUAGE plpgsql;

-- Update the reduce_product_stock function to log movements
CREATE OR REPLACE FUNCTION reduce_product_stock(product_id UUID, quantity_to_reduce INTEGER, reference_id UUID DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
  old_quantity INTEGER;
  new_quantity INTEGER;
BEGIN
  -- Get current stock
  SELECT stock_quantity INTO old_quantity FROM products WHERE id = product_id;
  
  -- Calculate new quantity
  new_quantity := GREATEST(0, old_quantity - quantity_to_reduce);
  
  -- Update stock
  UPDATE products 
  SET stock_quantity = new_quantity,
      updated_at = NOW()
  WHERE id = product_id;
  
  -- Log the movement
  PERFORM log_inventory_movement(
    product_id,
    'sale',
    -quantity_to_reduce,
    old_quantity,
    new_quantity,
    reference_id,
    'Stock reduced due to sale'
  );
END;
$$ LANGUAGE plpgsql;

-- Update the increase_product_stock function to log movements
CREATE OR REPLACE FUNCTION increase_product_stock(product_id UUID, quantity_to_add INTEGER, movement_type VARCHAR(20) DEFAULT 'restock', reference_id UUID DEFAULT NULL, notes TEXT DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
  old_quantity INTEGER;
  new_quantity INTEGER;
BEGIN
  -- Get current stock
  SELECT stock_quantity INTO old_quantity FROM products WHERE id = product_id;
  
  -- Calculate new quantity
  new_quantity := old_quantity + quantity_to_add;
  
  -- Update stock
  UPDATE products 
  SET stock_quantity = new_quantity,
      updated_at = NOW()
  WHERE id = product_id;
  
  -- Log the movement
  PERFORM log_inventory_movement(
    product_id,
    movement_type,
    quantity_to_add,
    old_quantity,
    new_quantity,
    reference_id,
    COALESCE(notes, 'Stock increased')
  );
END;
$$ LANGUAGE plpgsql;
