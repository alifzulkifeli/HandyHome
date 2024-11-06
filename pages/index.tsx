import Card from '@/components/card'
import Category from '@/components/dd-category'
import City from '@/components/location/dd-city'
import Postcode from '@/components/location/dd-postcode'
import State from '@/components/location/dd-state'
import DDLocation from '@/components/location/dd-state'
import Page from '@/components/page'
import Section from '@/components/section'

const Index = () => (
	<Page>
		<Section>
			<div className='flex w-full'  >
				<State />
				<City />
				<Postcode  />
			</div>
			<Category />

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
