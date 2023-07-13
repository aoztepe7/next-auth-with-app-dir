import { getServerSession } from 'next-auth';
import { LoginButton, LogoutButton, ProfileButton, RegisterButton } from './components/buttons.components';
import { authOptions } from '@/lib/auth';
import { User } from './components/user.component';
import { SendToLogin } from './components/sendtologin.component';
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    redirect('/login')
  else
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <div>
          <LoginButton />
          <RegisterButton />
          <LogoutButton />
          <ProfileButton />
          <h1>Server Session</h1>
          <pre>{JSON.stringify(session)}</pre>
          <User />
        </div>
      </main>
    );
}
