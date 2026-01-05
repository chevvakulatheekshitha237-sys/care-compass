import { motion } from "framer-motion";
import { Star, Calendar, MapPin } from "lucide-react";
import { Button } from "./ui/button";

const specialists = [
  {
    name: "Dr. Sarah Chen",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 127,
    location: "Downtown Medical Center",
    availability: "Available Today",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Dr. Michael Roberts",
    specialty: "General Practitioner",
    rating: 4.8,
    reviews: 243,
    location: "City Health Clinic",
    availability: "Next: Tomorrow 9AM",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Dr. Emily Watson",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 189,
    location: "Skin Care Institute",
    availability: "Available Today",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Dr. James Kim",
    specialty: "Gastroenterologist",
    rating: 4.7,
    reviews: 156,
    location: "Digestive Health Center",
    availability: "Next: Wed 2PM",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face",
  },
];

const Specialists = () => {
  return (
    <section id="specialists" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Our <span className="gradient-text">Specialists</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with top-rated healthcare professionals across various specialties. 
            Our AI matches you with the best doctor for your specific needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialists.map((doctor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card-elevated rounded-2xl overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-semibold text-primary-foreground">{doctor.name}</p>
                  <p className="text-xs text-primary-foreground/80">{doctor.specialty}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-urgent fill-urgent" />
                  <span className="text-sm font-semibold text-foreground">{doctor.rating}</span>
                  <span className="text-xs text-muted-foreground">({doctor.reviews} reviews)</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs">{doctor.location}</span>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-routine" />
                  <span className="text-xs font-medium text-routine">{doctor.availability}</span>
                </div>

                {/* Book Button */}
                <Button variant="default" size="sm" className="w-full mt-2">
                  Book Appointment
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialists;
