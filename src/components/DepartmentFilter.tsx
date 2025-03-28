'use client';
import { useState, useEffect, useRef } from 'react';

// Services
import { metApi, Department } from '@/api/metApi';

interface DepartmentFilterProps {
  selectedDepartment: number | undefined;
  onDepartmentChange: (departmentId: number | undefined) => void;
}

export default function DepartmentFilter({ 
  selectedDepartment, 
  onDepartmentChange 
}: DepartmentFilterProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // get name of selected department
  const getSelectedDepartmentName = () => {
    if (selectedDepartment === undefined) return 'All Departments';
    const dept = departments.find(d => d.departmentId === selectedDepartment);
    return dept ? dept.displayName : 'All Departments';
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await metApi.getDepartments();
        setDepartments(response.departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
        Filter by Department
      </h2>
      
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          <span className="text-gray-600 dark:text-gray-300">Loading departments...</span>
        </div>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>{getSelectedDepartmentName()}</span>
            <svg 
              className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 max-h-60 overflow-auto">
              <button
                onClick={() => {
                  onDepartmentChange(undefined);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  selectedDepartment === undefined
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                All Departments
              </button>
              
              {departments.map(dept => (
                <button
                  key={dept.departmentId}
                  onClick={() => {
                    onDepartmentChange(dept.departmentId);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    selectedDepartment === dept.departmentId
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {dept.displayName}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}