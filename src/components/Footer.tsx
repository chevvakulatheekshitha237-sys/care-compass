import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Medi<span className="text-primary">Care</span>
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              AI-powered symptom checker and appointment scheduling platform. 
              Your health, intelligently managed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#specialists" className="hover:text-primary transition-colors">Specialists</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">HIPAA Compliance</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Medical Disclaimer</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                support@medicare.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                1-800-MEDICARE
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-primary-foreground/10">
          <div className="bg-primary-foreground/5 rounded-xl p-4 mb-6">
            <p className="text-xs text-primary-foreground/60 text-center">
              ⚕️ <strong>Medical Disclaimer:</strong> This platform provides informational guidance only and is not a substitute 
              for professional medical diagnosis, treatment, or advice. Always consult a qualified healthcare provider 
              for medical concerns. In case of emergency, call 911 or your local emergency services immediately.
            </p>
          </div>
          <p className="text-center text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} MediCare. All rights reserved. HIPAA Compliant.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
