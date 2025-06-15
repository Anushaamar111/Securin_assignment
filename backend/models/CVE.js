import mongoose from 'mongoose';

const cveSchema = new mongoose.Schema({
  cveId: String,
  descriptions: Array,
  metrics: Object,
  published: Date,
  lastModified: Date,
  references: Array,
  sourceIdentifier: String,
  vulnStatus: String,
  configurations: Array, 
}, { timestamps: true });

export default mongoose.model('Cve', cveSchema);
