// Components to be imported in the (main folder) should be here

import { SAMPLE_DATA } from '@/app/constants/sample' // constant file for texts that are not changing

export default function LoginText() {
  return (
    <div className='mb-8'>
      <h1 className='text-4xl font-bold text-gray-800 mb-2'>Sample text</h1>
      <h2 className='text-2xl text-gray-600'>{SAMPLE_DATA.title}</h2>
    </div>
  )
}
