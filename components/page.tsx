import Head from 'next/head'
import Appbar from '@/components/appbar'
import BottomNav from '@/components/bottom-nav'

interface Props {
	title?: string
	children: React.ReactNode
	padding: number
}

const Page = ({ title, children,padding = 6 }: Props) => (
	<>
		{title ? (
			<Head>
				<title>HandyHome | {title}</title>
			</Head>
		) : null}

		<Appbar />

		<main
			/**
			 * Padding top = `appbar` height
			 * Padding bottom = `bottom-nav` height
			 */
			className='mx-auto max-w-screen-md pt-20 pb-16 px-safe sm:pb-0'
		>
			<div className={'p-'+ padding}>{children}</div>
		</main>

		<BottomNav />
	</>
)

export default Page
