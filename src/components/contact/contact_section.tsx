import { Card } from "@/components/ui/card"
import { ContactForm } from "./contact-form"
import { SupportCard } from "./support-card"

export default function ContactSection() {
  return (
    <main id="contact" className="mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-12 text-center text-4xl font-bold text-foreground sm:text-5xl">
          Contact <span className="font-thryez text-lime-500">Thryves</span>
        </h1>

        <div className="grid gap-6 lg:grid-cols-2">
          <ContactForm />
          <div className="grid grid-rows-2 gap-6">
            <SupportCard />
            <Card className="bg-background dark:bg-gray-950 flex flex-col w-full justify-between !p-0 rounded-3xl border border-border sm:h-auto h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.358611223558!2d-84.50198192524634!3d33.9576210731927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f513c22519b2b7%3A0x2f633ba8098338a3!2s1800%20Roswell%20Rd%20%232100%2C%20Marietta%2C%20GA%2030062%2C%20USA!5e0!3m2!1sen!2s!4v1739297630564!5m2!1sen!2s"
                className="w-full rounded-3xl h-full"
                loading="lazy"
              ></iframe>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

