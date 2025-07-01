import mongoose from "mongoose";

const sectorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  count: { type: Number }, // Number of startups or funding rounds in this sector
  isTrending: { type: Boolean, default: false },
  isEmerging: { type: Boolean, default: false },
  color: { type: String }, // For UI display
});

const Sector = mongoose.models.sector || mongoose.model("sector", sectorSchema);
export default Sector;
