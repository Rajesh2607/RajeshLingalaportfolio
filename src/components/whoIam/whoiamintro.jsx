import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const WhoIAmIntro = () => {
    const [myself, setMyself] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "wholam", "1");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setMyself(docSnap.data().myself || "");
                } else {
                    setMyself("No data found.");
                }
            } catch (error) {
                setMyself("Error fetching data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="overflow-x-hidden">
            <div className="min-h-screen bg-[#0a192f] text-white flex items-center justify-center px-6 py-12 relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl text-center z-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#17c0f8]">Who I Am</h1>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        {loading ? "Loading..." : myself}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default WhoIAmIntro;