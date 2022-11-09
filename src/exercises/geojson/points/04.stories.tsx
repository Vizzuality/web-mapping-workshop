import { Story } from '@storybook/react/types-6-0';

const StoryMap = {
  title: 'Exercises/Geojson/Points',
  argTypes: {},
};

export default StoryMap;

const Template: Story = () => {
  return (
    <div className="relative w-full h-screen">
      Draw a geojson point collection, center it on the map and display them as
      <ul>
        <li>Circle clusters</li>

        <li>Circle</li>
        <li>color: #ffCC00</li>
        <li>border: #000000</li>
        <li>radius: 20</li>
        <li>opacity: 0.5</li>

        <li>Cluster</li>
        <li>color: #00CC00</li>
        <li>border: #000000</li>
        <li>radius: 50</li>
        <li>opacity: 1</li>
        <li>count inside</li>
      </ul>
    </div>
  );
};

export const Points04 = Template.bind({});
Points04.args = {};
