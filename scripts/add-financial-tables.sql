-- Add financial tracking tables for payment processing and business analytics

-- Payment intents tracking
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'created',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial transactions for comprehensive tracking
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- payment_received, refund_issued, dispute_created, etc.
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  order_id UUID REFERENCES orders(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business analytics view
CREATE OR REPLACE VIEW financial_summary AS
SELECT 
  DATE_TRUNC('day', processed_at) as date,
  currency,
  SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as revenue,
  SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as refunds_disputes,
  SUM(amount) as net_revenue,
  COUNT(CASE WHEN amount > 0 THEN 1 END) as successful_payments,
  COUNT(CASE WHEN amount < 0 THEN 1 END) as refunds_disputes_count
FROM financial_transactions 
WHERE status = 'completed'
GROUP BY DATE_TRUNC('day', processed_at), currency
ORDER BY date DESC;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_intents_stripe_id ON payment_intents(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(processed_at);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_order ON financial_transactions(order_id);
