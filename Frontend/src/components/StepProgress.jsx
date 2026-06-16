import styles from './StepProgress.module.css';
import { Check } from 'lucide-react';

const STEPS = [
    { label: 'Pickup', icon: '📦' },
    { label: 'Delivery', icon: '🏠' },
    { label: 'Parcel', icon: '📋' },
    { label: 'Payment', icon: '💳' },
];

export default function StepProgress({ currentStep }) {
    // currentStep is 1-indexed (1 = Pickup, 2 = Delivery, 3 = Parcel, 4 = Payment)
    return (
        <div className={styles.wrapper}>
            <div className={styles.stepper}>
                {STEPS.map((step, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isActive = stepNum === currentStep;
                    return (
                        <div key={step.label} className={styles.stepGroup}>
                            {/* Connector line (before each step except first) */}
                            {index > 0 && (
                                <div className={`${styles.connector} ${isCompleted ? styles.connectorDone : ''}`} />
                            )}
                            <div className={styles.stepItem}>
                                <div className={`${styles.stepCircle} ${isCompleted ? styles.stepDone : ''} ${isActive ? styles.stepActive : ''}`}>
                                    {isCompleted
                                        ? <Check size={16} strokeWidth={3} />
                                        : <span className={styles.stepIcon}>{step.icon}</span>
                                    }
                                </div>
                                <span className={`${styles.stepLabel} ${isActive ? styles.labelActive : ''} ${isCompleted ? styles.labelDone : ''}`}>
                                    {step.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className={styles.stepHint}>Step {currentStep} of {STEPS.length}</p>
        </div>
    );
}
