
import React, { useState, useReducer } from 'react';
import { submitForm } from '../services/api';

const releaseFormText = {
  title: 'Safaricom Hook – Model Release Form',
  activity: 'Activity: Interviews to be used for Online Media',
  paragraphs: [
    'I agree to be interviewed and to have my story recorded by videography and to have my photographs taken using camera devices (the “said material”) by Safaricom PLC (hereinafter “Safaricom”) or Safaricom’s agents, contractors for purposes of communicating, marketing and advertising any and all matters relating to Safaricom PLC, select shareholders, affiliates and partners.',
    'I agree and acknowledge that the said material has been obtained by Safaricom in pursuance of the above stated action and that the said material will be utilized by Safaricom in perpetuity.',
    'I permit Safaricom and Safaricom’s licensees, select shareholders, affiliates, partners, assignees or clients to use, (for a period of at least two years) the said material and/or drawings, from them and any other reproductions or adaptations of the said materials, either complete or in part for any kind of communication and advertising.',
    'I further permit Safaricom’s licensees, select shareholders, affiliates, partners, assignees or clients to use the said materials in any media electronic or otherwise or before any forum or gatherings including and any other material for purpose of education, communication, promotion and advertising by Safaricom PLC.',
    'I understand and accept that I shall receive no fee or future payment for my appearance and participation for the use of the said material in the advertising and public relations of Safaricom PLC or for the use of the said material in any Safaricom related venture whether now or in future.',
    'I understand and accept that I shall neither sue nor bring any proceeding against any such parties for, any liability, loss, demands, claims or causes of action, whether now known or unknown, for copyright or any similar matter, or based upon or relating to the use and exploitation of the said material.',
    'I further understand and accept that all rights to the said material are assigned to Safaricom PLC to use as it so wishes.',
  ],
};

const initialState = {
  surname: '', otherNames: '', poBox: '', town: '', telephone: '', email: '',
  idNumber: '', eventName: '', eventLocation: '',
  date: new Date().toISOString().split('T')[0],
  consent: false,
};

type State = typeof initialState;
type Action = { type: 'SET_FIELD'; field: keyof State; value: string | boolean };

function formReducer(state: State, action: Action): State {
  return { ...state, [action.field]: action.value };
}

const FormPage = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof State, string>>>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [referenceId, setReferenceId] = useState('');

  const validate = () => {
    const newErrors: Partial<Record<keyof State, string>> = {};
    if (!state.surname) newErrors.surname = 'Surname is required.';
    if (!state.otherNames) newErrors.otherNames = 'Other names are required.';
    if (!state.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(state.email)) newErrors.email = 'Email is invalid.';
    if (!state.telephone) newErrors.telephone = 'Telephone number is required.';
    if (!state.idNumber) newErrors.idNumber = 'ID/Passport number is required.';
    if (!state.eventName) newErrors.eventName = 'Event name is required.';
    if (!state.date) newErrors.date = 'Date is required.';
    if (!state.consent) newErrors.consent = 'You must give your consent to proceed.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmissionStatus('submitting');
    try {
      const { consent, ...formData } = state;
      const result = await submitForm(formData);
      setReferenceId(result.referenceId);
      setSubmissionStatus('success');
    } catch (error) {
      setSubmissionStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    dispatch({
      type: 'SET_FIELD',
      field: name as keyof State,
      value: type === 'checkbox' ? checked : value,
    });
  };

  if (submissionStatus === 'success') {
    return (
      <div className="bg-safaricom-light p-8 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-safaricom-green mb-4">Thank You!</h2>
        <p className="text-lg mb-2">Your consent has been successfully recorded.</p>
        <p className="text-md text-gray-600 mb-6">A copy of the signed form has been sent to your email address.</p>
        <p className="text-sm text-gray-500">Your reference ID is: <span className="font-mono bg-gray-200 p-1 rounded">{referenceId}</span></p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-safaricom-light p-6 md:p-10 rounded-xl shadow-2xl">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-center text-safaricom-dark mb-2">{releaseFormText.title}</h1>
        <h2 className="text-lg font-semibold text-center text-gray-600 mb-6">{releaseFormText.activity}</h2>
        <div className="space-y-4 text-gray-700">
          {releaseFormText.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-safaricom-dark mb-6">Digital Consent Form</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(initialState).filter(k => !['consent', 'date'].includes(k)).map(key => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={key === 'email' ? 'email' : key === 'telephone' ? 'tel' : 'text'}
                id={key}
                name={key}
                value={state[key as keyof Omit<State, 'consent'|'date'>]}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 bg-white border ${errors[key as keyof State] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-safaricom-green focus:border-safaricom-green sm:text-sm`}
              />
              {errors[key as keyof State] && <p className="mt-1 text-sm text-red-600">{errors[key as keyof State]}</p>}
            </div>
          ))}
           <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={state.date}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-safaricom-green focus:border-safaricom-green sm:text-sm`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={state.consent}
                onChange={handleChange}
                className="focus:ring-safaricom-green h-4 w-4 text-safaricom-green border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="consent" className="font-medium text-gray-700">I confirm that I have read and understood the above Model Release Form and I voluntarily give my full consent.</label>
            </div>
          </div>
          {errors.consent && <p className="mt-1 text-sm text-red-600">{errors.consent}</p>}
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={submissionStatus === 'submitting'}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-safaricom-light bg-safaricom-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-safaricom-green disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submissionStatus === 'submitting' ? 'Submitting...' : 'Submit'}
          </button>
          {submissionStatus === 'error' && <p className="mt-2 text-center text-sm text-red-600">Submission failed. Please try again.</p>}
        </div>
      </form>
    </div>
  );
};

export default FormPage;
