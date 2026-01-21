// Components to be imported in the (main folder) should be here

import { SAMPLE_DATA } from '@/app/constants/sample' // constant file for texts that are not changing

export default function LoginText() {
  return (
    <>
      <h1>Sample text</h1>
      <h2>{SAMPLE_DATA.title}</h2>
    </>
  )
}
