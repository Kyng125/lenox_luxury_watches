"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Award, Clock, Shield, Users } from "lucide-react"

const stats = [
  { icon: Clock, label: "Years of Excellence", value: "50+" },
  { icon: Users, label: "Satisfied Customers", value: "10,000+" },
  { icon: Award, label: "Luxury Brands", value: "25+" },
  { icon: Shield, label: "Warranty Coverage", value: "Lifetime" },
]

const team = [
  {
    name: "Marcus Lenox",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=300&width=300",
    bio: "With over 30 years in luxury timepieces, Marcus founded Lenox to bring the world's finest watches to discerning collectors.",
  },
  {
    name: "Isabella Chen",
    role: "Master Horologist",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Isabella oversees our authentication and restoration services, ensuring every timepiece meets our exacting standards.",
  },
  {
    name: "James Morrison",
    role: "Curator of Collections",
    image: "/placeholder.svg?height=300&width=300",
    bio: "James travels the world sourcing rare and exceptional timepieces for our exclusive collections.",
  },
]

export function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 gold-gradient">Our Story</h1>
              <p className="text-xl text-gray-300 mb-6">
                For over five decades, Lenox Luxury Watches has been the premier destination for the world's finest
                timepieces, serving collectors and enthusiasts with unparalleled expertise and service.
              </p>
              <p className="text-gray-300 mb-8">
                Founded in 1973 by master horologist Marcus Lenox, our company began as a small boutique specializing in
                vintage Swiss watches. Today, we represent the most prestigious brands in the world, offering both
                contemporary masterpieces and rare vintage treasures.
              </p>
              <Button className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold px-8 py-3">
                Explore Our Heritage
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Lenox Luxury Watches boutique interior"
                width={600}
                height={500}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-black" />
                </div>
                <div className="text-3xl font-bold gold-gradient mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold mb-6 gold-gradient">Our Mission</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12">
            To preserve and celebrate the art of fine watchmaking by connecting passionate collectors with the world's
            most exceptional timepieces, while providing unmatched expertise and service.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
              <h3 className="font-serif text-xl font-bold mb-4 gold-gradient">Authenticity</h3>
              <p className="text-gray-300">
                Every timepiece is thoroughly authenticated by our master horologists, ensuring you receive only genuine
                luxury watches.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
              <h3 className="font-serif text-xl font-bold mb-4 gold-gradient">Excellence</h3>
              <p className="text-gray-300">
                We maintain the highest standards in curation, service, and customer care, reflecting our commitment to
                horological excellence.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
              <h3 className="font-serif text-xl font-bold mb-4 gold-gradient">Heritage</h3>
              <p className="text-gray-300">
                We honor the rich traditions of watchmaking while embracing innovation and the future of luxury
                timepieces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="font-serif text-4xl font-bold text-center mb-12 gold-gradient">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 gold-gradient">{member.name}</h3>
                <p className="text-yellow-400 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-300">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
