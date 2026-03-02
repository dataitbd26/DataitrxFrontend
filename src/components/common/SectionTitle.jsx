import React from 'react';

const SectionTitle = ({ title, subtitle, rightElement }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold font-secondary text-casual-black dark:text-concrete transition-colors">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm font-primary text-casual-black/70 dark:text-concrete/70 mt-1 transition-colors">
            {subtitle}
          </p>
        )}
      </div>
      {rightElement && (
        <div className="w-full md:w-auto">
          {rightElement}
        </div>
      )}
    </div>
  );
};

export default SectionTitle;