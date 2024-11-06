import Card from '@/components/card'
import Category from '@/components/dd-category'
import City from '@/components/dd-city'
import Postcode from '@/components/dd-postcode'
import DDLocation from '@/components/dd-state'
import Page from '@/components/page'
import Section from '@/components/section'

const Index = () => (
	<Page>
		<Section>
			<div className='flex w-full'  >
				<DDLocation width={"1/3 mr-2"} name={"State"} />
				<DDLocation width={"1/3 mr-2"} name={"City"} />
				<DDLocation width={"1/3"} name={"Postcode"} />

				{/* <City /> */}
				{/* <Postcode/> */}
			</div>
			<DDLocation width={"full"} name={"Category"} />

			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />

		</Section>
	</Page>
)

export default Index
