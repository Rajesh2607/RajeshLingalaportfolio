import { motion } from "framer-motion";
import { Info } from "lucide-react"; // or any icon you prefer

const Note = () => {
  return (
    <section
      aria-label="Reminder Note"
      className="py-12 bg-[#112240] text-white w-full overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6"
      >
        <motion.div
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #22d3ee" }}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl shadow-xl transition-all duration-300 cursor-pointer"
        >
          <Info size={22} className="animate-pulse text-white" />
          <p className="text-base sm:text-lg font-semibold tracking-wide">
            Don’t forget to visit other pages too!
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Note;
