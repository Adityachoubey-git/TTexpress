import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import {
  Eye,
  FileDown,
  FileText,
  RefreshCcw,
  Search,
  Trash2,
} from 'lucide-react'
import {
  deleteInspectionReport,
  getInspectionReports,
  getInspectionStats,
  getIntakeRecords,
  saveInspectionReport,
} from '../utils/storage'
import PdfInspectionReport from '../components/report/PdfInspectionReport'
const inspectionSchema = z.object({
  sourceIntakeId: z.string().optional(),
  vehicleNumber: z.string().trim().min(1, 'Vehicle number is required'),
  companyName: z.string().trim().min(1, 'Company name is required'),
  fleetOwnerName: z.string().trim().min(1, 'Fleet owner name is required'),
  fleetOwnerContact: z.string().trim().min(1, 'Fleet owner contact is required'),
  sourceJobType: z.enum(['Quick Service', 'General Service'], {
    errorMap: () => ({ message: 'Please select job type' }),
  }),
  inspectionDate: z.string().min(1, 'Inspection date is required'),
  inspectorName: z.string().trim().min(1, 'Inspector name is required'),
  odometerReading: z.string().trim().min(1, 'Odometer reading is required'),
  overallCondition: z.enum(['Good', 'Fair', 'Poor'], {
    errorMap: () => ({ message: 'Please select overall condition' }),
  }),
  inspectionSummary: z
    .string()
    .trim()
    .min(10, 'Please add a short inspection summary'),
  workRecommended: z
    .string()
    .trim()
    .min(10, 'Please add recommended work'),
  generalServiceRemark: z.string().trim().optional(),
  estimatedCost: z.string().trim().optional(),
  estimatedDelivery: z.string().trim().optional(),
})

function buildReportId() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(100 + Math.random() * 900)
  return `RPT-${yyyy}${mm}${dd}-${random}`
}

function StatCard({ label, value, helper }) {
  return (
    <div className="card p-4">
      <p className="text-sm font-medium text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-[var(--color-brand-dark)]">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{helper}</p>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[170px_1fr] gap-3 border-b border-gray-100 py-2 text-sm">
      <span className="font-semibold text-[var(--color-brand-dark)]">{label}</span>
      <span className="text-gray-700 whitespace-pre-wrap">{value || '—'}</span>
    </div>
  )
}

export default function InspectionReportsPage() {
  const previewRef = useRef(null)

  const [intakes, setIntakes] = useState([])
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState({
    totalReports: 0,
    thisMonthReports: 0,
    quickServiceReports: 0,
    generalServiceReports: 0,
    lastGeneratedAt: 'No reports yet',
  })
  const [generatedReport, setGeneratedReport] = useState(null)
  const [selectedIntakeMeta, setSelectedIntakeMeta] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('All')

  const defaultValues = useMemo(
    () => ({
      sourceIntakeId: '',
      vehicleNumber: '',
      companyName: '',
      fleetOwnerName: '',
      fleetOwnerContact: '',
      sourceJobType: 'Quick Service',
      inspectionDate: new Date().toISOString().slice(0, 10),
      inspectorName: '',
      odometerReading: '',
      overallCondition: 'Good',
      inspectionSummary: '',
      workRecommended: '',
      generalServiceRemark: '',
      estimatedCost: '',
      estimatedDelivery: '',
    }),
    []
  )

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(inspectionSchema),
    defaultValues,
    mode: 'onChange',
  })

  const selectedIntakeId = watch('sourceIntakeId')
  const selectedJobType = watch('sourceJobType')

  const refreshAll = () => {
    setIntakes(getIntakeRecords())
    setReports(getInspectionReports())
    setStats(getInspectionStats())
  }

  useEffect(() => {
    refreshAll()
  }, [])

  useEffect(() => {
    if (!selectedIntakeId) {
      setSelectedIntakeMeta(null)
      return
    }

    const selected = intakes.find((item) => item.intakeId === selectedIntakeId)
    if (!selected) return

    setSelectedIntakeMeta(selected)

    reset({
      ...defaultValues,
      sourceIntakeId: selected.intakeId,
      vehicleNumber: selected.vehicleNumber || '',
      companyName: selected.companyName || '',
      fleetOwnerName: selected.fleetOwnerName || '',
      fleetOwnerContact: selected.fleetOwnerContact || '',
      sourceJobType: selected.jobType || 'Quick Service',
      inspectionDate: new Date().toISOString().slice(0, 10),
      generalServiceRemark: '',
    })
  }, [selectedIntakeId, intakes, reset, defaultValues])

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.reportId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter =
        jobTypeFilter === 'All' || item.sourceJobType === jobTypeFilter

      return matchesSearch && matchesFilter
    })
  }, [reports, searchTerm, jobTypeFilter])

  const onSubmit = (data) => {
    const finalReport = {
      reportId: buildReportId(),
      generatedAt: new Date().toLocaleString(),
      generatedAtISO: new Date().toISOString(),
      preparedBy: 'System Generated',
      ...data,
      generalServiceDetails:
        data.sourceJobType === 'General Service'
          ? {
              exteriorBodyCondition:
                selectedIntakeMeta?.exteriorBodyCondition || 'Not available',
              paintCondition:
                selectedIntakeMeta?.paintCondition || 'Not available',
              batteryHealth:
                selectedIntakeMeta?.batteryHealth !== undefined &&
                selectedIntakeMeta?.batteryHealth !== null
                  ? `${selectedIntakeMeta.batteryHealth}%`
                  : 'Not available',
              tyrePressure:
                selectedIntakeMeta?.tyrePressure || 'Not available',
              generalServiceRemark:
                data.generalServiceRemark || 'No additional remark added',
            }
          : null,
    }

    console.log('Generated Inspection Report:', finalReport)
    saveInspectionReport(finalReport)
    setGeneratedReport(finalReport)
    refreshAll()
  }

  const handleLoadReport = (report) => {
    setGeneratedReport(report)

    reset({
      sourceIntakeId: report.sourceIntakeId || '',
      vehicleNumber: report.vehicleNumber || '',
      companyName: report.companyName || '',
      fleetOwnerName: report.fleetOwnerName || '',
      fleetOwnerContact: report.fleetOwnerContact || '',
      sourceJobType: report.sourceJobType || 'Quick Service',
      inspectionDate: report.inspectionDate || new Date().toISOString().slice(0, 10),
      inspectorName: report.inspectorName || '',
      odometerReading: report.odometerReading || '',
      overallCondition: report.overallCondition || 'Good',
      inspectionSummary: report.inspectionSummary || '',
      workRecommended: report.workRecommended || '',
      generalServiceRemark:
        report.generalServiceDetails?.generalServiceRemark || '',
      estimatedCost: report.estimatedCost || '',
      estimatedDelivery: report.estimatedDelivery || '',
    })
  }

  const handleDeleteReport = (reportId) => {
    deleteInspectionReport(reportId)

    if (generatedReport?.reportId === reportId) {
      setGeneratedReport(null)
    }

    refreshAll()
  }

const handleDownloadPdf = async () => {
  if (!generatedReport || !previewRef.current) return

  const target = previewRef.current

  const canvas = await html2canvas(target, {
    scale: 2.2,
    backgroundColor: '#ffffff',
    useCORS: true,
    width: target.scrollWidth,
    windowWidth: target.scrollWidth,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(`${generatedReport.reportId}.pdf`)
}

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Reports"
          value={stats.totalReports}
          helper="All generated inspection reports"
        />
        <StatCard
          label="This Month"
          value={stats.thisMonthReports}
          helper="Created in current month"
        />
        <StatCard
          label="Quick Service"
          value={stats.quickServiceReports}
          helper="Quick service reports"
        />
        <StatCard
          label="General Service"
          value={stats.generalServiceReports}
          helper="General service reports"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="card p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="section-title">Inspection Report Generator</h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Simple report creation with quick remarks and downloadable PDF.
              </p>
            </div>

            <button
              type="button"
              onClick={refreshAll}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <RefreshCcw size={16} />
              Refresh Data
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-5">
              <div className="border-b border-gray-200 pb-3">
                <h3 className="section-title">Source Intake / Vehicle Details</h3>
              </div>

              <div>
                <label className="label">Select Intake Record</label>
                <select {...register('sourceIntakeId')} className="select">
                  <option value="">Manual Entry</option>
                  {intakes.map((item) => (
                    <option key={item.intakeId} value={item.intakeId}>
                      {item.intakeId} • {item.vehicleNumber} • {item.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="label">Vehicle Number</label>
                  <input {...register('vehicleNumber')} className="input" />
                  {errors.vehicleNumber && (
                    <p className="error-text">{errors.vehicleNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Company Name</label>
                  <input {...register('companyName')} className="input" />
                  {errors.companyName && (
                    <p className="error-text">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Fleet Owner Name</label>
                  <input {...register('fleetOwnerName')} className="input" />
                  {errors.fleetOwnerName && (
                    <p className="error-text">{errors.fleetOwnerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Fleet Owner Contact</label>
                  <input {...register('fleetOwnerContact')} className="input" />
                  {errors.fleetOwnerContact && (
                    <p className="error-text">{errors.fleetOwnerContact.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Job Type</label>
                  <select {...register('sourceJobType')} className="select">
                    <option value="Quick Service">Quick Service</option>
                    <option value="General Service">General Service</option>
                  </select>
                  {errors.sourceJobType && (
                    <p className="error-text">{errors.sourceJobType.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Inspection Date</label>
                  <input {...register('inspectionDate')} type="date" className="input" />
                  {errors.inspectionDate && (
                    <p className="error-text">{errors.inspectionDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Inspector Name</label>
                  <input
                    {...register('inspectorName')}
                    className="input"
                    placeholder="Enter inspector name"
                  />
                  {errors.inspectorName && (
                    <p className="error-text">{errors.inspectorName.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Odometer Reading</label>
                  <input
                    {...register('odometerReading')}
                    className="input"
                    placeholder="e.g. 42,350 km"
                  />
                  {errors.odometerReading && (
                    <p className="error-text">{errors.odometerReading.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Overall Condition</label>
                  <select {...register('overallCondition')} className="select">
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                  {errors.overallCondition && (
                    <p className="error-text">{errors.overallCondition.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Estimated Cost</label>
                  <input
                    {...register('estimatedCost')}
                    className="input"
                    placeholder="e.g. ₹4,500"
                  />
                </div>

                <div>
                  <label className="label">Estimated Delivery</label>
                  <input
                    {...register('estimatedDelivery')}
                    className="input"
                    placeholder="e.g. Same Day / 24 hrs"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="border-b border-gray-200 pb-3">
                <h3 className="section-title">Simple Inspection Notes</h3>
              </div>

              <div>
                <label className="label">Inspection Summary</label>
                <textarea
                  {...register('inspectionSummary')}
                  className="textarea"
                  placeholder="Example: Vehicle inspected, brakes are okay, battery is stable, tyres have normal wear."
                />
                {errors.inspectionSummary && (
                  <p className="error-text">{errors.inspectionSummary.message}</p>
                )}
              </div>

              <div>
                <label className="label">Recommended Work</label>
                <textarea
                  {...register('workRecommended')}
                  className="textarea"
                  placeholder="Example: Do routine service, check brake pads, top-up battery terminals, and verify tyre pressure."
                />
                {errors.workRecommended && (
                  <p className="error-text">{errors.workRecommended.message}</p>
                )}
              </div>

              {selectedJobType === 'General Service' && (
                <div className="rounded-2xl border border-red-100 bg-red-50/40 p-4">
                  <h4 className="text-sm font-bold text-[var(--color-brand-dark)]">
                    General Service Detail Notes
                  </h4>

                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-3 text-sm">
                      <p className="font-semibold text-[var(--color-brand-dark)]">
                        Exterior Body
                      </p>
                      <p className="mt-1 text-gray-700">
                        {selectedIntakeMeta?.exteriorBodyCondition || 'Not available'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-3 text-sm">
                      <p className="font-semibold text-[var(--color-brand-dark)]">
                        Paint Condition
                      </p>
                      <p className="mt-1 text-gray-700">
                        {selectedIntakeMeta?.paintCondition || 'Not available'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-3 text-sm">
                      <p className="font-semibold text-[var(--color-brand-dark)]">
                        Battery Health
                      </p>
                      <p className="mt-1 text-gray-700">
                        {selectedIntakeMeta?.batteryHealth !== undefined &&
                        selectedIntakeMeta?.batteryHealth !== null
                          ? `${selectedIntakeMeta.batteryHealth}%`
                          : 'Not available'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-3 text-sm">
                      <p className="font-semibold text-[var(--color-brand-dark)]">
                        Tyre Pressure
                      </p>
                      <p className="mt-1 text-gray-700">
                        {selectedIntakeMeta?.tyrePressure || 'Not available'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="label">Additional Remark</label>
                    <textarea
                      {...register('generalServiceRemark')}
                      className="textarea"
                      placeholder="Example: Battery looks good, paint is slightly faded, tyre pressure should be adjusted."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="btn-primary inline-flex items-center gap-2"
                disabled={isSubmitting}
              >
                <FileText size={18} />
                {isSubmitting ? 'Generating...' : 'Generate Report'}
              </button>

              <button
                type="button"
                className="btn-secondary inline-flex items-center gap-2"
                onClick={handleDownloadPdf}
                disabled={!generatedReport}
              >
                <FileDown size={18} />
                Download PDF
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-6">
         <section className="card overflow-hidden">
  <div className="report-strip px-5 py-4 sm:px-6">
    <h2 className="text-lg font-bold">Inspection Report Preview</h2>
    <p className="mt-1 text-sm text-white/70">
      Final branded TT Xpress report preview
    </p>
  </div>

  <div className="bg-[#f5f7fb] p-4 sm:p-5">
    {!generatedReport ? (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-[var(--color-text-muted)]">
        Generate a report to see the TT Xpress styled PDF preview here.
      </div>
    ) : (
      <div className="overflow-auto rounded-2xl">
        <div ref={previewRef}>
          <PdfInspectionReport report={generatedReport} />
        </div>
      </div>
    )}
  </div>
</section>

          <section className="card p-5 sm:p-6">
            <div className="mb-4">
              <h3 className="section-title">Recent Reports</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Search, filter, preview, and delete reports
              </p>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px]">
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Search by report ID, vehicle, company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="select"
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
              >
                <option value="All">All Job Types</option>
                <option value="Quick Service">Quick Service</option>
                <option value="General Service">General Service</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredReports.length === 0 ? (
                <div className="text-sm text-[var(--color-text-muted)]">
                  No matching reports found.
                </div>
              ) : (
                filteredReports.slice(0, 8).map((item) => (
                  <div
                    key={item.reportId}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[var(--color-brand-dark)]">
                          {item.reportId}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.vehicleNumber} • {item.companyName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.generatedAt}
                        </p>
                      </div>

                      <span className="badge badge-red">{item.sourceJobType}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-secondary inline-flex items-center gap-2"
                        onClick={() => handleLoadReport(item)}
                      >
                        <Eye size={16} />
                        Load
                      </button>

                      <button
                        type="button"
                        className="btn-secondary inline-flex items-center gap-2"
                        onClick={() => handleDeleteReport(item.reportId)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}