import React from 'react';

// Import your company logos here
import accenture from '../Company Logo/accenture.png';
import amazon from '../Company Logo/amazon.png';
import cognizant from '../Company Logo/cognizant.png';
import mrcooper from '../Company Logo/mrcooper.png';
import opentext from '../Company Logo/opentext.png';
import paypal from '../Company Logo/paypal.png';
import presidio from '../Company Logo/presidio.png';
import Salesforce from '../Company Logo/salesforce.png';
import slb from '../Company Logo/slb.png';
import Virtusa from '../Company Logo/Virtusa.png';
import trimble from '../Company Logo/trimble.png';
import urjanet from '../Company Logo/urjanet.png';
import zoho from '../Company Logo/zoho.png';
import musigma from '../Company Logo/musigma.png';
import oracle from '../Company Logo/oracle.png';

// Array of company data
const companies = [
  { name: 'Virtusa', logo: Virtusa },
  { name: 'Accenture', logo: accenture },
  { name: 'Amazon', logo: amazon },
  { name: 'Cognizant', logo: cognizant },
  { name: 'Mr.Cooper', logo: mrcooper },
  { name: 'Mu Sigma', logo: musigma },
  { name: 'OpenText', logo: opentext},
  { name: 'Paypal', logo: paypal },
  { name: 'Presidio', logo: presidio },
  // Add more companies to make the scroll longer
  { name: 'Salesforce', logo: Salesforce }, // Reusing for example
  { name: 'SLB', logo: slb },
  { name: 'Trimble', logo: trimble },
  { name: 'Urjanet', logo: urjanet },
  { name: 'Zoho', logo: zoho },
  { name: 'Oracle', logo: oracle },
];

const CompanyScroller = ({ direction = 'ltr', speed = 'medium' }) => {
  const animationClass = direction === 'ltr' ? 'animate-scroll-ltr' : 'animate-scroll-rtl';
  let durationClass = '';

  // You can define different speeds by adjusting animation duration in CSS
  switch (speed) {
    case 'slow':
      durationClass = 'animation-duration-30s'; // Example, define in CSS
      break;
    case 'fast':
      durationClass = 'animation-duration-20s'; // Example, define in CSS
      break;
    case 'medium':
    default:
      durationClass = 'animation-duration-30s'; // Example, define in CSS
      break;
  }

  // Duplicate companies to create a seamless loop effect
  const repeatedCompanies = [...companies, ...companies];

  return (
    <div className="relative w-full overflow-hidden whitespace-nowrap py-4 my-2">
      <div className={`scrolling-wrapper ${animationClass} ${durationClass} flex-shrink-0`}>
        {repeatedCompanies.map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className="inline-flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-4 mx-4 flex-shrink-0"
            style={{ minWidth: '180px', height: '100px' }} // Fixed size for consistency
          >
            <img src={company.logo} alt={company.name} className="h-10 w-auto object-contain mr-3" />
            <span className="text-lg font-semibold text-gray-800">{company.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyScroller;