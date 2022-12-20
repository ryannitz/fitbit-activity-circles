
const colorSet = [
  {color: "black"},
  {color: "darkslategrey"},
  {color: "dimgrey"},
  {color: "grey"},
  {color: "lightgrey"},
  {color: "beige"},
  {color: "white"},
  {color: "maroon"},
  {color: "saddlebrown"},
  {color: "darkgoldenrod"},
  {color: "goldenrod"},
  {color: "rosybrown"},
  {color: "wheat"},
  {color: "navy"},
  {color: "blue"},
  {color: "dodgerblue"},
  {color: "deepskyblue"},
  {color: "aquamarine"},
  {color: "cyan"},
  {color: "olive"},
  {color: "darkgreen"},
  {color: "green"},
  {color: "springgreen"},
  {color: "limegreen"},
  {color: "palegreen"},
  {color: "lime"},
  {color: "greenyellow"},
  {color: "darkslateblue"},
  {color: "slateblue"},
  {color: "purple"},
  {color: "fuchsia"},
  {color: "plum"},
  {color: "orchid"},
  {color: "lavender"},
  {color: "darkkhaki"},
  {color: "khaki"},
  {color: "lemonchiffon"},
  {color: "yellow"},
  {color: "gold"},
  {color: "orangered"},
  {color: "orange"},
  {color: "coral"},
  {color: "lightpink"},
  {color: "palevioletred"},
  {color: "deeppink"},
  {color: "darkred"},
  {color: "crimson"},
  {color: "red"}       
];

const colorOptions = [
  ['Background Color', 'colorBackground'],
  ['Dividers Color', 'colorDividers'],
  ['Time Color', 'colorTime'],
  ['Date Color', 'colorDate'],
  ['Header Color', 'colorHeader'],
  ['HRM Text Color', 'colorHRM'],
  ['HRM Heart Color', 'colorImgHRM'],
  ['Activity Color', 'colorActivity']
];

function mySettings(props) {
  return (
    <Page>
      <Section
        description={<Text>Select a numerical base that the decimal time will be converted to. For user-defined bases, the max base will be restricted to 26 and the lowest of base 2.</Text>}
        title={<Text allign="center">Time Base Conversion</Text>}>
        <Select
          label={`Base-Selection`}
          settingsKey="baseChangeSetting"
          options={[
            {name:"Random Base Change", desc:"Random base convsersion every minute", value:"randomBaseChange"},
            {name:"No Base Change", desc:"No base conversion is made", value:"noBaseChange"},
            {name:"User-Defined", desc:"User-defined constance base conversion", value:"userDefinedBaseChange"}
          ]}
          renderItem={
            (option) =>
              <TextImageRow
                label={option.name}
                sublabel={option.desc}
                icon="/project/resources/images/distance.png"
              />
          }
        />
        <TextInput
          label="User-Defined base"
          placeholder="10"
          settingsKey="userDefinedBase"
          type="number"
          onChange={
            (newVal) =>
              console.log(newVal)
          }
        />
       
      </Section>
      {colorOptions.map(([title, settingsKey]) =>
        <Section
          title={title}>
          <ColorSelect
            settingsKey={settingsKey}
            colors={colorSet} />
        </Section>
      )}
      
      <Toggle
        settingsKey="overrideStatIconColor"
        label="Apply Activity color to Activity Icons"
      />
    </Page>
  );
  
}
registerSettingsPage(mySettings);