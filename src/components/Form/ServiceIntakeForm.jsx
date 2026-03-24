import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClipboardCheck, RotateCcw } from 'lucide-react'
import { buildReportData } from '../../utils/buildReportData'
import { saveIntakeRecord } from '../../utils/storage'

const phoneRegex = /^[0-9+\-\s()]{7,15}$/

const batteryHealthSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) return undefined
  const num = Number(value)
  return Number.isNaN(num) ? value : num
}, z.number().min(0, 'Battery health must be at least 0%').max(100, 'Battery health cannot exceed 100%').optional())

const serviceIntakeSchema = z
  .object({
    vehicleNumber: z
      .string()
      .trim()
      .min(1, 'Vehicle number is required')
      .max(20, 'Vehicle number is too long'),

    companyName: z
      .string()
      .trim()
      .min(1, 'Company name is required')
      .max(100, 'Company name is too long'),

    fleetOwnerName: z
      .string()
      .trim()
      .min(1, 'Fleet owner name is required')
      .max(100, 'Fleet owner name is too long'),

    fleetOwnerContact: z
      .string()
      .trim()
      .min(1, 'Fleet owner contact is required')
      .regex(phoneRegex, 'Enter a valid contact number'),

    fleetOwnerEmail: z
      .string()
      .trim()
      .min(1, 'Fleet owner email is required')
      .email('Enter a valid email address'),

    issueDescription: z
      .string()
      .trim()
      .min(1, 'Issue description is required')
      .min(10, 'Please describe the issue in a little more detail')
      .max(1000, 'Issue description is too long'),

    jobType: z.enum(['Quick Service', 'General Service'], {
      errorMap: () => ({ message: 'Please select a job type' }),
    }),

    exteriorBodyCondition: z.string().optional(),
    paintCondition: z.string().optional(),
    batteryHealth: batteryHealthSchema,
    tyrePressure: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.jobType === 'General Service') {
      if (!data.exteriorBodyCondition) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['exteriorBodyCondition'],
          message: 'Please select exterior body condition',
        })
      }

      if (!data.paintCondition) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['paintCondition'],
          message: 'Please select paint condition',
        })
      }

      if (data.batteryHealth === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['batteryHealth'],
          message: 'Battery health is required',
        })
      }

      if (!data.tyrePressure || !data.tyrePressure.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['tyrePressure'],
          message: 'Tyre pressure is required',
        })
      }
    }
  })

const radioInputClass =
  'h-4 w-4 border-gray-300 text-[var(--color-brand-red)] focus:ring-[var(--color-brand-red)]'

export default function ServiceIntakeForm({ onSubmitSuccess }) {
  const defaultValues = useMemo(
    () => ({
      vehicleNumber: '',
      companyName: '',
      fleetOwnerName: '',
      fleetOwnerContact: '',
      fleetOwnerEmail: '',
      issueDescription: '',
      jobType: 'Quick Service',
      exteriorBodyCondition: '',
      paintCondition: '',
      batteryHealth: undefined,
      tyrePressure: '',
    }),
    []
  )

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm({
    resolver: zodResolver(serviceIntakeSchema),
    defaultValues,
    mode: 'onChange',
  })

  const selectedJobType = watch('jobType')
  const isGeneralService = selectedJobType === 'General Service'

 const onSubmit = (data) => {
  const cleanedData =
    data.jobType === 'Quick Service'
      ? {
          ...data,
          exteriorBodyCondition: undefined,
          paintCondition: undefined,
          batteryHealth: undefined,
          tyrePressure: undefined,
        }
      : data

  console.log('Submitted Intake Data:', cleanedData)

  const reportData = buildReportData(cleanedData)
  saveIntakeRecord(reportData)
  onSubmitSuccess(reportData)
}

  const handleReset = () => {
    reset(defaultValues)
    onSubmitSuccess(null)
  }

  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="section-title">Service Intake Form</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Capture vehicle service intake details and generate a structured intake report.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-5">
          <div className="border-b border-gray-200 pb-3">
            <h3 className="section-title">Vehicle & Company Details</h3>
          </div>

          <div>
            <label className="label">Vehicle Number</label>
            <input
              {...register('vehicleNumber')}
              className="input"
              placeholder="e.g. HR55AB1234"
            />
            {errors.vehicleNumber && (
              <p className="error-text">{errors.vehicleNumber.message}</p>
            )}
          </div>

          <div>
            <label className="label">Company Name</label>
            <input
              {...register('companyName')}
              className="input"
              placeholder="Enter company name"
            />
            {errors.companyName && (
              <p className="error-text">{errors.companyName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="border-b border-gray-200 pb-3">
            <h3 className="section-title">Fleet Owner Details</h3>
          </div>

          <div>
            <label className="label">Fleet Owner Name</label>
            <input
              {...register('fleetOwnerName')}
              className="input"
              placeholder="Enter fleet owner name"
            />
            {errors.fleetOwnerName && (
              <p className="error-text">{errors.fleetOwnerName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="label">Fleet Owner Contact</label>
              <input
                {...register('fleetOwnerContact')}
                className="input"
                placeholder="Enter contact number"
              />
              {errors.fleetOwnerContact && (
                <p className="error-text">{errors.fleetOwnerContact.message}</p>
              )}
            </div>

            <div>
              <label className="label">Fleet Owner Email</label>
              <input
                {...register('fleetOwnerEmail')}
                type="email"
                className="input"
                placeholder="Enter email address"
              />
              {errors.fleetOwnerEmail && (
                <p className="error-text">{errors.fleetOwnerEmail.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="border-b border-gray-200 pb-3">
            <h3 className="section-title">Service Details</h3>
          </div>

          <div>
            <label className="label">Issue Description</label>
            <textarea
              {...register('issueDescription')}
              className="textarea"
              placeholder="Describe the reported issue"
            />
            {errors.issueDescription && (
              <p className="error-text">{errors.issueDescription.message}</p>
            )}
          </div>

          <div>
            <label className="label">Job Type</label>
            <select {...register('jobType')} className="select">
              <option value="Quick Service">Quick Service</option>
              <option value="General Service">General Service</option>
            </select>
            {errors.jobType && (
              <p className="error-text">{errors.jobType.message}</p>
            )}
          </div>
        </div>

        {isGeneralService && (
          <div className="space-y-5 rounded-2xl border border-red-100 bg-red-50/40 p-4 sm:p-5">
            <div className="border-b border-red-100 pb-3">
              <h3 className="section-title">General Service Inspection</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Additional inspection fields are required for General Service.
              </p>
            </div>

            <div>
              <label className="label">Exterior Body Condition</label>
              <div className="flex flex-wrap gap-5">
                {['Good', 'Minor Damage', 'Major Damage'].map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      {...register('exteriorBodyCondition')}
                      type="radio"
                      value={option}
                      className={radioInputClass}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {errors.exteriorBodyCondition && (
                <p className="error-text">{errors.exteriorBodyCondition.message}</p>
              )}
            </div>

            <div>
              <label className="label">Paint Condition</label>
              <div className="flex flex-wrap gap-5">
                {['Good', 'Faded', 'Scratched/Chipped'].map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      {...register('paintCondition')}
                      type="radio"
                      value={option}
                      className={radioInputClass}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {errors.paintCondition && (
                <p className="error-text">{errors.paintCondition.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="label">Battery Health (%)</label>
                <input
                  {...register('batteryHealth')}
                  type="number"
                  min="0"
                  max="100"
                  className="input"
                  placeholder="e.g. 85"
                />
                {errors.batteryHealth && (
                  <p className="error-text">{errors.batteryHealth.message}</p>
                )}
              </div>

              <div>
                <label className="label">Tyre Pressure</label>
                <input
                  {...register('tyrePressure')}
                  className="input"
                  placeholder='e.g. "32 PSI"'
                />
                {errors.tyrePressure && (
                  <p className="error-text">{errors.tyrePressure.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="btn-primary inline-flex items-center gap-2"
            disabled={isSubmitting}
          >
            <ClipboardCheck size={18} />
            {isSubmitting ? 'Submitting...' : 'Submit Intake'}
          </button>

          <button
            type="button"
            className="btn-secondary inline-flex items-center gap-2"
            onClick={handleReset}
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>

        {isSubmitted && Object.keys(errors).length === 0 && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Form validated successfully. The structured report has been generated on submit.
          </div>
        )}
      </form>
    </section>
  )
}