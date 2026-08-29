import React, { useState } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import './DataTable.css';

const DataTable = ({ 
  columns, 
  data, 
  loading = false, 
  pagination = false, 
  itemsPerPage = 10,
  expandable = false,
  renderExpanded = null
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});

  const handleSort = (key) => {
    if (!columns.find(c => c.key === key)?.sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = pagination 
    ? sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : sortedData;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading) {
    return <div className="table-loading">Loading data...</div>;
  }

  if (data.length === 0) {
    return <div className="table-empty">No data available</div>;
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {expandable && <th className="expand-col"></th>}
            {columns.map(col => (
              <th 
                key={col.key} 
                className={col.sortable ? 'sortable' : ''}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {col.sortable && <span className="sort-icon">{getSortIcon(col.key)}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, idx) => (
            <React.Fragment key={row.id || idx}>
              <tr className={expandedRows[row.id] ? 'expanded' : ''}>
                {expandable && (
                  <td className="expand-col">
                    <button className="expand-btn" onClick={() => toggleRow(row.id)}>
                      {expandedRows[row.id] ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
              {expandable && expandedRows[row.id] && renderExpanded && (
                <tr className="expanded-content">
                  <td colSpan={columns.length + 1}>
                    {renderExpanded(row)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {pagination && totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;