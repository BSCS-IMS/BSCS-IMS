export default function ResellerTable() {
  return (
    <div className='bg-white rounded-lg shadow-sm border'>
      <table className='w-full text-sm'>
        <thead className='border-b'>
          <tr>
            <th className='text-left p-3'>Reseller</th>
            <th>Status</th>
            <th className='text-right p-3'>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr className='border-b'>
            <td className='p-3'>Juan Trading</td>
            <td>
              <span className='px-2 py-1 text-xs rounded bg-green-100 text-green-700'>Active</span>
            </td>
            <td className='p-3 text-right'>
              <button className='text-purple-600 text-sm'>View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
