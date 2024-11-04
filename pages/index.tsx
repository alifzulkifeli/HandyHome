import Card from '@/components/card'
import Category from '@/components/dd-category'
import City from '@/components/dd-city'
import Postcode from '@/components/dd-postcode'
import State from '@/components/dd-state'
import Page from '@/components/page'
import Section from '@/components/section'

const Index = () => (
	<Page>
		<Section>
			<div className='flex' >
				<State />
				<City />
				<Postcode/>
			</div>
			<Category/>
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
