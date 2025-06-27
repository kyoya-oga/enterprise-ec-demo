import Link from 'next/link';
import { loginAction } from '@/lib/actions/login';
import { useFormState } from 'react-dom';
import LoginForm from './LoginForm';

export default function LoginPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { redirect?: string };
}) {
  return (
    <div>
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
          アカウントにログイン
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          または{' '}
          <Link
            href={`/${locale}/register`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            新しいアカウントを作成
          </Link>
        </p>
      </div>

      <LoginForm locale={locale} redirectTo={searchParams?.redirect} />
    </div>
  );
}
