import { useState } from 'react';
import { ChevronLeft, Code2, User, Briefcase, CreditCard, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import type { ProjectComponentProps } from '../../types';

// ==================== TYPES ====================
interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ProfessionalInfo {
  company: string;
  position: string;
  experience: string;
  salary: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface FormData {
  personal: PersonalInfo;
  professional: ProfessionalInfo;
  payment: PaymentInfo;
}

type Step = 1 | 2 | 3 | 4;

// ==================== COMPOSANT PRINCIPAL ====================
export default function MultiStepFormProject({ onBack }: ProjectComponentProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    professional: {
      company: '',
      position: '',
      experience: '',
      salary: '',
    },
    payment: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: User },
    { number: 2, title: 'Informations professionnelles', icon: Briefcase },
    { number: 3, title: 'Paiement', icon: CreditCard },
    { number: 4, title: 'Confirmation', icon: Check },
  ];

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const updateProfessionalInfo = (field: keyof ProfessionalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      professional: { ...prev.professional, [field]: value },
    }));
  };

  const updatePaymentInfo = (field: keyof PaymentInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      payment: { ...prev.payment, [field]: value },
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Formulaire soumis avec succès !');
  };

  const isStepValid = (step: Step): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.personal.firstName &&
          formData.personal.lastName &&
          formData.personal.email &&
          formData.personal.phone
        );
      case 2:
        return !!(
          formData.professional.company &&
          formData.professional.position &&
          formData.professional.experience
        );
      case 3:
        return !!(
          formData.payment.cardNumber &&
          formData.payment.cardName &&
          formData.payment.expiryDate &&
          formData.payment.cvv
        );
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Multi-step Form</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Multi-step", "Form Validation", "State Management"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                const isAccessible = step.number === 1 || isStepValid((step.number - 1) as Step);

                return (
                  <div key={step.number} className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => isAccessible && goToStep(step.number as Step)}
                      disabled={!isAccessible}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all mb-2 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-indigo-500 text-white scale-110'
                          : isAccessible
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                    </button>
                    <span
                      className={`text-xs text-center font-medium hidden md:block ${
                        isCurrent ? 'text-indigo-600' : 'text-gray-600'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px] mb-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="text-indigo-500" size={28} />
                  Informations personnelles
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.personal.firstName}
                      onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.personal.lastName}
                      onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.personal.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={formData.personal.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Info */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Briefcase className="text-indigo-500" size={28} />
                  Informations professionnelles
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Entreprise *
                    </label>
                    <input
                      type="text"
                      value={formData.professional.company}
                      onChange={(e) => updateProfessionalInfo('company', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="TechCorp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Poste *
                    </label>
                    <input
                      type="text"
                      value={formData.professional.position}
                      onChange={(e) => updateProfessionalInfo('position', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="Développeur Full Stack"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Années d'expérience *
                    </label>
                    <select
                      value={formData.professional.experience}
                      onChange={(e) => updateProfessionalInfo('experience', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="0-1">0-1 an</option>
                      <option value="1-3">1-3 ans</option>
                      <option value="3-5">3-5 ans</option>
                      <option value="5-10">5-10 ans</option>
                      <option value="10+">10+ ans</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Salaire souhaité (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.professional.salary}
                      onChange={(e) => updateProfessionalInfo('salary', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="50 000 €"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Info */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="text-indigo-500" size={28} />
                  Informations de paiement
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Numéro de carte *
                    </label>
                    <input
                      type="text"
                      value={formData.payment.cardNumber}
                      onChange={(e) => updatePaymentInfo('cardNumber', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom sur la carte *
                    </label>
                    <input
                      type="text"
                      value={formData.payment.cardName}
                      onChange={(e) => updatePaymentInfo('cardName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="JOHN DOE"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date d'expiration *
                      </label>
                      <input
                        type="text"
                        value={formData.payment.expiryDate}
                        onChange={(e) => updatePaymentInfo('expiryDate', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={formData.payment.cvv}
                        onChange={(e) => updatePaymentInfo('cvv', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Check className="text-green-500" size={28} />
                  Récapitulatif
                </h2>

                <div className="space-y-6">
                  {/* Personal Info Summary */}
                  <div className="bg-indigo-50 rounded-lg p-6">
                    <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                      <User size={20} />
                      Informations personnelles
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Nom complet:</span>
                        <p className="text-gray-900">
                          {formData.personal.firstName} {formData.personal.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Email:</span>
                        <p className="text-gray-900">{formData.personal.email}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Téléphone:</span>
                        <p className="text-gray-900">{formData.personal.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Info Summary */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <Briefcase size={20} />
                      Informations professionnelles
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Entreprise:</span>
                        <p className="text-gray-900">{formData.professional.company}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Poste:</span>
                        <p className="text-gray-900">{formData.professional.position}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Expérience:</span>
                        <p className="text-gray-900">{formData.professional.experience}</p>
                      </div>
                      {formData.professional.salary && (
                        <div>
                          <span className="font-semibold text-gray-700">Salaire:</span>
                          <p className="text-gray-900">{formData.professional.salary}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Info Summary */}
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <CreditCard size={20} />
                      Informations de paiement
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Carte:</span>
                        <p className="text-gray-900">**** **** **** {formData.payment.cardNumber.slice(-4)}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Nom:</span>
                        <p className="text-gray-900">{formData.payment.cardName}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Expiration:</span>
                        <p className="text-gray-900">{formData.payment.expiryDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft size={20} />
              Précédent
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isStepValid(currentStep)
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Suivant
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
              >
                <Check size={20} />
                Soumettre
              </button>
            )}
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-indigo-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-indigo-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>State Management</strong>: Gestion complexe de formulaire multi-étapes
              </li>
              <li>
                • <strong>Validation</strong>: Validation conditionnelle par étape
              </li>
              <li>
                • <strong>Navigation</strong>: Contrôle de navigation entre étapes
              </li>
              <li>
                • <strong>Progress Indicator</strong>: Barre de progression visuelle
              </li>
              <li>
                • <strong>Conditional Rendering</strong>: Affichage conditionnel des étapes
              </li>
              <li>
                • <strong>Form Handling</strong>: Gestion des inputs et updates
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                const [currentStep, setCurrentStep] = useState&lt;Step&gt;(1);
              </p>
              <p className="text-sm text-gray-600 font-mono">
                const isStepValid = (step: Step) =&gt; {'{...}'};
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Bonnes pratiques:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Validation à chaque étape</li>
                <li>Sauvegarde progressive des données</li>
                <li>Navigation intuitive (précédent/suivant)</li>
                <li>Indicateur de progression clair</li>
                <li>Récapitulatif avant soumission</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}