// entry point of web (should be login page here)

// only imported components/modules should be the code here unless if there are specific reasons why there are other codes should be here


import LoginText from '../modules/login-page/LoginText'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <>
      <LoginText />
      <Link href={'/dashboard'}>
        Test redirection
      </Link>
    </>
  )
}
