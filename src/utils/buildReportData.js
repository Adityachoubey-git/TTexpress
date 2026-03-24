import { generateIntakeId } from './generateIntakeId'

export function buildReportData(formData) {
  const submittedAt = new Date()

  const jobTypeMeta =
    formData.jobType === 'Quick Service'
      ? {
          servicePriority: 'Fast Turnaround',
          recommendedBay: 'Express Service Bay',
          intakeCategory: 'Routine / Minor Issue',
          reportStatus: 'Ready for Quick Processing',
        }
      : {
          servicePriority: 'Detailed Inspection',
          recommendedBay: 'Full Diagnostic Bay',
          intakeCategory: 'Inspection / Repair-Oriented',
          reportStatus: 'Requires Technical Evaluation',
        }

  return {
    intakeId: generateIntakeId(),
    submittedAt: submittedAt.toLocaleString(),
    preparedBy: 'System Generated',
    ...formData,
    ...jobTypeMeta,
  }
}