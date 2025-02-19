import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

export function SupportCard() {
  
  return (
    <Card className="bg-background dark:bg-gray-950 flex flex-col w-full justify-between p-6 rounded-3xl border border-border">
      <CardHeader className="space-y-1 p-0">
        <h2 className="text-2xl font-medium text-foreground">Contact Information</h2>
      </CardHeader>
      <CardContent className="p-0 mt-4 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-primary" />
            <Link href="mailto:infor@thryve.today " className="text-foreground hover:underline">infor@thryve.today</Link>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-primary" />
            <Link href="tel:+19794847983" className="text-foreground hover:underline">+1 (979) 484-7983</Link>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <p className="text-foreground">1800 Roswell Road Suite 2100, Marietta, Georgia 30062, US</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-medium">Hours</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <p>Mon-Fri</p>
            <p>09:00 am - 05:00 pm</p>
            <p>Sat-Sun</p>
            <p>Closed</p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Link href="https://www.facebook.com/profile.php?id=61572394157007" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="rounded-full">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Button>
          </Link>
          <Link href="https://www.instagram.com/thryve.today_" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="rounded-full">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
