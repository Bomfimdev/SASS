import React from 'react';
import PropTypes from 'prop-types';

const Table = ({
  columns,
  data,
  onRowClick,
  isLoading = false,
  emptyMessage = 'Nenhum dado disponível',
  className = '',
  stripedRows = true,
  hoverable = true,
  bordered = false,
  compact = false,
  ...props
}) => {
  const borderedClasses = bordered ? 'border border-gray-200' : '';
  const compactClasses = compact ? 'text-sm' : '';
  
  const renderHeader = () => (
    <thead className="bg-gray-50 text-gray-700">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${column.className || ''}`}
            style={column.width ? { width: column.width } : {}}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
  
  const renderRows = () => (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.length > 0 ? (
        data.map((row, rowIndex) => (
          <tr 
            key={rowIndex}
            className={`
              ${hoverable ? 'cursor-pointer hover:bg-gray-50' : ''}
              ${stripedRows && rowIndex % 2 !== 0 ? 'bg-gray-50' : ''}
            `}
            onClick={() => onRowClick && onRowClick(row)}
          >
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className={`px-6 py-4 whitespace-nowrap ${column.cellClassName || ''}`}
              >
                {column.render ? column.render(row) : row[column.accessor]}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan={columns.length}
            className="px-6 py-4 text-center text-gray-500"
          >
            {emptyMessage}
          </td>
        </tr>
      )}
    </tbody>
  );
  
  const renderLoadingState = () => (
    <tbody>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          {columns.map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className={`overflow-x-auto ${className} ${borderedClasses}`}>
      <table className={`min-w-full divide-y divide-gray-200 ${compactClasses}`} {...props}>
        {renderHeader()}
        {isLoading ? renderLoadingState() : renderRows()}
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.node.isRequired,
      accessor: PropTypes.string,
      render: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      className: PropTypes.string,
      cellClassName: PropTypes.string
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
  isLoading: PropTypes.bool,
  emptyMessage: PropTypes.node,
  className: PropTypes.string,
  stripedRows: PropTypes.bool,
  hoverable: PropTypes.bool,
  bordered: PropTypes.bool,
  compact: PropTypes.bool
};

export default Table;