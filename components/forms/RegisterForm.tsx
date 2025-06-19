"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
// import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { FileUploader } from "../FileUploader";
import SubmitButton from "../SubmitButton";
import { registerPatient } from "@/lib/actions/patient.actions";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
      };
      // @ts-ignore
      const newPatient = await registerPatient(patientData);

      if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="px-8 pt-8 pb-6">
        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Welcome 👋
        </CardTitle>
        <CardDescription className="text-base text-gray-600 dark:text-gray-300/90 mt-2 leading-relaxed">
          Your journey matters to us. What would you like to share about
          yourself?
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-12"
          >
            <section className="space-y-8 bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-100/50 dark:border-gray-700/30">
              <div className="mb-6 space-y-2">
                <div className="w-fit px-3 py-1.5 bg-primary-500/10 dark:bg-primary-400/10 rounded-full">
                  <h2 className="sub-header text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider">
                    PERSONAL INFORMATION
                  </h2>
                </div>
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gray-200/80 dark:via-gray-700/50 to-transparent"></div>
              </div>

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                placeholder="Sam Smith"
                iconSrc="/assets/icons/user.svg"
                iconAlt="user"
              />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email address"
                  placeholder="samsmith@gmail.com"
                  iconSrc="/assets/icons/email.svg"
                  iconAlt="email"
                />

                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phone"
                  label="Phone Number"
                  placeholder="(844) 123-4567"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="birthDate"
                  label="Date of birth"
                />

                <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="gender"
                  label="Gender"
                  renderSkeleton={(field) => (
                    <FormControl>
                      <RadioGroup
                        className="flex h-11 gap-6 justify-between"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {GenderOptions.map((option, i) => (
                          <div
                            key={option + i}
                            className="flex items-center gap-2"
                          >
                            <RadioGroupItem
                              value={option}
                              id={option}
                              className="h-5 w-5 border-2 border-gray-400 dark:border-gray-500 text-primary-600 dark:text-primary-400 cursor-pointer"
                            />
                            <Label
                              htmlFor={option}
                              className="cursor-pointer text-gray-700 dark:text-gray-300 font-medium"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder="Sector-23, Gurgaon, IN - 122016"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="occupation"
                  label="Occupation"
                  placeholder="Software Engineer"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="emergencyContactName"
                  label="Emergency contact name"
                  placeholder="Guardian's name"
                />

                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="emergencyContactNumber"
                  label="Emergency contact number"
                  placeholder="(844) 123-4567"
                />
              </div>
            </section>

            <section className="space-y-8 bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-100/50 dark:border-gray-700/30">
              <div className="mb-6 space-y-2">
                <div className="w-fit px-3 py-1.5 bg-primary-500/10 dark:bg-primary-400/10 rounded-full">
                  <h2 className="sub-header text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider">
                    MEDICAL INFORMATION
                  </h2>
                </div>
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gray-200/80 dark:via-gray-700/50 to-transparent"></div>
              </div>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Primary care physician"
                placeholder="Select a physician"
              >
                {Doctors.map((doctor, i) => (
                  <SelectItem
                    key={doctor.name + i}
                    value={doctor.name}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={doctor.image}
                        width={32}
                        height={32}
                        alt="doctor"
                        className="rounded-full border border-dark-500"
                      />
                      <span className="text-gray-800 dark:text-gray-200">
                        {doctor.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="insuranceProvider"
                  label="Insurance provider"
                  placeholder="LIC Health Insurance"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="insurancePolicyNumber"
                  label="Insurance policy number"
                  placeholder="ABC123456789"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="allergies"
                  label="Allergies (if any)"
                  placeholder="Peanuts, Penicillin, Pollen"
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="currentMedication"
                  label="Current medications"
                  placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="familyMedicalHistory"
                  label="Family medical history (if relevant)"
                  placeholder="Mother had thoroidal aortic aneurysm, Father has hypertension"
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="pastMedicalHistory"
                  label="Past medical history"
                  placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
                />
              </div>
            </section>

            <section className="space-y-8 bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-100/50 dark:border-gray-700/30">
              <div className="mb-6 space-y-2">
                <div className="w-fit px-3 py-1.5 bg-primary-500/10 dark:bg-primary-400/10 rounded-full">
                  <h2 className="sub-header text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider">
                    IDENTIFICATION AND VERIFICATION
                  </h2>
                </div>
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gray-200/80 dark:via-gray-700/50 to-transparent"></div>
              </div>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="identificationType"
                label="Identification Type"
                placeholder="Select identification type"
              >
                {IdentificationTypes.map((type, i) => (
                  <SelectItem
                    key={type + i}
                    value={type}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                  >
                    {type}
                  </SelectItem>
                ))}
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="identificationNumber"
                label="Identification Number"
                placeholder="123456789"
              />

              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="identificationDocument"
                label="Scanned Copy of Identification Document"
                renderSkeleton={(field) => (
                  <FormControl>
                    <FileUploader
                      files={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            </section>

            <section className="space-y-8 bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-100/50 dark:border-gray-700/30">
              <div className="mb-6 space-y-2">
                <div className="w-fit px-3 py-1.5 bg-primary-500/10 dark:bg-primary-400/10 rounded-full">
                  <h2 className="sub-header text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider">
                    CONSENT AND PRIVACY
                  </h2>
                </div>
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gray-200/80 dark:via-gray-700/50 to-transparent"></div>
              </div>

              <div className="space-y-6">
                <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="treatmentConsent"
                  label="I consent to receive treatment for my health condition."
                />

                <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="disclosureConsent"
                  label="I consent to the use and disclosure of my health information for treatment purposes."
                />

                <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="privacyConsent"
                  label="I acknowledge that I have reviewed and agree to the privacy policy"
                />
              </div>
            </section>

            <div className="pt-4">
              <SubmitButton
                isLoading={isLoading}
                className="w-full py-6 text-lg font-semibold"
              >
                Submit and Continue
              </SubmitButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
