import { motion } from 'framer-motion';

export default function ErrorPage() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
            >
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Oops!</h1>
                <p style={{ fontSize: '1.5rem' }}>Algo deu errado.</p>
            </motion.div>
        </div>
    );
}