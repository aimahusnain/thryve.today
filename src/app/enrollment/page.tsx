export default function EnrollmentAgreement() {
  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Thryve.Today</h1>
            <p className="text-gray-600">1800 Roswell Road Suite 2100</p>
            <p className="text-gray-600">
              Phone: 979-484-7982 | Email: info@thryve.today
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Nursing Assistant Student Enrollment Agreement
          </h2>

          {/* Student Information */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              STUDENT INFORMATION
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  STUDENT NAME:
                </label>
                <input type="text" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  ADDRESS:
                </label>
                <input type="text" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  CITY/STATE/ZIP:
                </label>
                <input type="text" className="w-full border rounded p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    PHONE NUMBERS: H)
                  </label>
                  <input type="text" className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">C)</label>
                  <input type="text" className="w-full border rounded p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  E-MAIL ADDRESS:
                </label>
                <input type="email" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  SOCIAL SECURITY #:
                </label>
                <input type="text" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  STUDENT STATE ID #:
                </label>
                <input type="text" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  EMERGENCY CONTACT:
                </label>
                <input type="text" className="w-full border rounded p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    RELATIONSHIP:
                  </label>
                  <input type="text" className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    TELEPHONE #:
                  </label>
                  <input type="text" className="w-full border rounded p-2" />
                </div>
              </div>
            </div>
          </section>

          {/* Program Information */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              PROGRAM INFORMATION
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  DATE OF ADMISSION:
                </label>
                <input type="date" className="border rounded p-2" />
              </div>

              <div>
                <h4 className="font-bold mb-2">PROGRAM / COURSE NAME:</h4>
                <p>Nursing Assistant</p>
              </div>

              <div>
                <h4 className="font-bold mb-2">
                  DESCRIPTION OF PROGRAM / COURSE:
                </h4>
                <p className="text-gray-700">
                  The nurse assistant training program is an entry-level
                  healthcare career for students who prefer direct patient care.
                  The course teaches students how to communicate with patients
                  effectively, recognize medical emergencies, and provide
                  hands-on daily care needs while respecting the patient&apos;s
                  rights. This course is taught in English only. The course
                  consists of theory, lab, and clinical experiences.
                  Prerequisites for this course are satisfied during the
                  enrollment process. Students will learn to perform vital
                  signs, observe/report, provide ADL care, and follow infection
                  prevention measures. After successfully completing this
                  program, students will receive a certificate of completion and
                  be eligible to sit for the certified nursing assistant exam.
                </p>
                <p className="mt-4 text-gray-700">
                  Graduates of this program may find entry-level employment as a
                  nurse aide or certified nursing assistant working in
                  hospitals, home health, hospice, and long-term care
                  facilities, just to name a few.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2">PREREQUISITES:</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>16 years of age</li>
                  <li>Negative PPD or chest X-ray</li>
                  <li>Two forms of government-issued identification</li>
                  <li>Background check</li>
                  <li>Drug Screening</li>
                  <li>Immunization up to date</li>
                  <li>CPR</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-2">PROGRAM / COURSE OBJECTIVES:</h4>
                <p className="text-gray-700">
                  To provide high-quality, comprehensive healthcare training
                  programs that prepare students for successful careers in the
                  medical field, fostering excellence, integrity, and compassion
                  as healthcare professionals.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2">COURSE HOURS:</h4>
                <p className="text-gray-700">
                  138 Clock hours with the following breakdown. 84 hours of
                  classroom theory, 30 hours of lab, and 24 hours in clinical.
                </p>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-bold mb-4">
                  PROGRAM INFORMATION (CONTINUED)
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      PROGRAM START DATE:
                    </label>
                    <input type="date" className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      SCHEDULED END DATE:
                    </label>
                    <input type="date" className="w-full border rounded p-2" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Program Type:
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input type="radio" name="programType" className="mr-2" />
                      <span>FULL-TIME</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="programType"
                        className="mr-2"
                        defaultChecked
                      />
                      <span>PART-TIME</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="schedule" className="mr-2" />
                      <span>DAY</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="schedule" className="mr-2" />
                      <span>EVENING</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    DAYS/EVENINGS CLASS MEETS:
                  </label>
                  <div className="flex space-x-4">
                    {["M", "T", "W", "Th", "F", "Sa", "Su"].map((day) => (
                      <label key={day} className="flex items-center">
                        <input type="checkbox" className="mr-1" />
                        <span>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      TIME CLASS BEGINS:
                    </label>
                    <input type="time" className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      TIME CLASS ENDS:
                    </label>
                    <input type="time" className="w-full border rounded p-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      NUMBER OF WEEKS:
                    </label>
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      TOTAL CLOCK HOURS:
                    </label>
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tuition & Fees */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              TUITION & FEES
            </h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Application fee:</span>
                  <span>$150</span>
                </div>
                <div className="flex justify-between">
                  <span>Lab:</span>
                  <span>$60</span>
                </div>
                <div className="flex justify-between">
                  <span>Uniform tops:</span>
                  <span>$25</span>
                </div>
                <div className="flex justify-between">
                  <span>Book:</span>
                  <span>$40</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuition:</span>
                  <span>$999</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>$1,124</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-bold mb-2">Replacement Cost</h4>
              <div className="bg-gray-50 p-4 rounded">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Lost book:</span>
                    <span>$50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uniform top:</span>
                    <span>$38</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cancellation Policy */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              CANCELLATION AND REFUND POLICIES
            </h3>
            <p className="text-gray-700">
              Any applicant who chooses to terminate their agreement with
              Thryve.today by 3rd day of class will be given a full refund of
              total minus a $150 administrative fee; Thryve.today must receive
              notice of withdrawal from class in writing via email to
              info@thryve.today or submit to the administrative office personnel
              by close of business on the first day of class. Thryve.today
              reserves the right to withhold an administrative fee of $150
              deposit and the listed fee for textbooks, workbooks, and scrubs.
              In an emergency (such as death or hospitalization), permission
              will be given to transfer classes for a fee of $150. Official
              documentation of said emergency must be submitted to the school
              immediately. No refund will be given if a student decides to
              withdraw after the first week of class.
            </p>
          </section>

          {/* Signature Section */}
          <section className="mt-12">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              STUDENT ACKNOWLEDGMENTS
            </h3>
            <p className="mb-6 text-gray-700">
              The student acknowledges receiving a copy of this completed
              agreement and the school course catalog before signing this
              agreement. By signing this agreement, the student acknowledges
              that he/she has read this agreement, understands the terms and
              conditions, and agrees to the conditions outlined in this
              agreement. The student and the school will retain a copy of this
              agreement.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="border-b border-black h-12 mb-2"></div>
                <div className="flex justify-between">
                  <span className="text-sm">Student&apos;s Signature</span>
                  <span className="text-sm">Date</span>
                </div>
              </div>
              <div>
                <div className="border-b border-black h-12 mb-2"></div>
                <div className="flex justify-between">
                  <span className="text-sm">Program Coordinator Signature</span>
                  <span className="text-sm">Date</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
