import * as React from "react";
import * as ReactDOM from "react-dom";

import { SheetContainer } from "trc-react/dist/SheetContainer";
import TRCContext from "trc-react/dist/context/TRCContext";
import { Panel } from "trc-react/dist/common/Panel";
import { HorizontalList } from "trc-react/dist/common/HorizontalList";
import { DescriptionList } from "trc-react/dist/common/DescriptionList";
import { AccordionPanel } from "trc-react/dist/common/AccordionPanel";
import { TextInput } from "trc-react/dist/common/TextInput";
import { SelectInput } from "trc-react/dist/common/SelectInput";
import { FullPageLoadingMessage } from "trc-react/dist/common/FullPageLoadingMessage";
import { Spinning } from "trc-react/dist/common/Spinning";
import { SpinnerSmall }  from "trc-react/dist/common/SpinnerSmall";
import { EmailTextInput } from "trc-react/dist/common/EmailTextInput";
import { ToolTip } from "trc-react/dist/common/ToolTip";
import Modal from "trc-react/dist/common/Modal";
import { TabsPanel } from "trc-react/dist/common/TabsPanel";
import { Copy } from "trc-react/dist/common/Copy";
import { Button } from "trc-react/dist/common/Button";
import { PluginShell } from "trc-react/dist/PluginShell";
import { SimpleTable } from "trc-react/dist/SimpleTable";
import { ColumnSelector } from "trc-react/dist/ColumnSelector";
import { FieldInputs } from "trc-react/dist/FieldInputs";
import { ListColumns } from "trc-react/dist/ListColumns";
import { PluginLink } from "trc-react/dist/PluginLink";
import { SheetSelector } from "trc-react/dist/SheetSelector";

import { TableBorders } from "./TableBorders";

interface IState {
  modal: boolean;
  loading: boolean;
  loading2: boolean;

  // Controls (like <TextInput> or <SelectInput>) should subscribe to OnChange and use that to 
  // update state with control's current value. 
  textValue: string;
  optionValue: string;
  email: string; 
}


export class App extends React.Component<{}, IState> {
  static contextType = TRCContext;

  public constructor(props: {}) {
    super(props);

    this.state = {
      modal: false,
      loading: false,
      loading2: false,
      textValue: "",
      optionValue: "",
      email:""
    };

    // All control handlers need to call .bind(). 
    this.onRowClick = this.onRowClick.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }

  private onRowClick(key: string) {
    alert(key);
  }

  // callbacks for controls.
  private onTextChange(
    value: string
  ): void {    
    this.setState({textValue :value});
  }

  private onSelectChange(
    value: string
  ): void {
    this.setState({optionValue: value});
  }

  render() {
    return (
      <PluginShell description="Plugin description" title="Plugin title">
        <Panel>
          <Copy>
            <h1>This is a text section</h1>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Veritatis corporis voluptate libero ipsum aperiam, optio
              distinctio laborum ullam soluta laudantium delectus maxime,
              molestias vel dolores sapiente! Alias, magni? Voluptatem, ut!
            </p>
            <p>Some info <ToolTip tooltipText="Some extra information"/>. More information here <ToolTip tooltipText="Another tip" />.  </p>
          </Copy>

          <DescriptionList
            entries={[
              ["First entry title", "Description list first entry description"],
              [
                "Second entry title",
                "Description list second entry description",
              ],
              ["Third entry title", "Description list third entry description"],
            ]}
          />

          <SimpleTable
            data={this.context._contents}
            onRowClick={this.onRowClick}
            disableQueryString={true}
            downloadIcon
            downloadPdf
          />

          <HorizontalList>
            <Button secondary onClick={() => alert("Secondary")}>
              Secondary
            </Button>
            <Button onClick={() => alert("Secondary")}>Primary</Button>
          </HorizontalList>
        </Panel>

        <Panel>
          <Copy>
            <h2>Inputs</h2>
          </Copy>

        <TableBorders>
            <table>
              <thead>
                <tr>
                  <td>Name</td><td>Example</td><td>state</td>
                </tr>
              </thead>
              <tr>
                <td>Text input</td>
                <td style={{border: '1px solid black'}}>
                    <TextInput
                      label="A text input example"
                      placeholder="Type something..."
                      onChange={(e) => this.onTextChange(e.target.value)}
                      error={this.state.textValue.length < 3 ? "Must be at least 3 chars" : null}
                    />
                </td>
                <td>
                  Text state: {this.state.textValue}
                </td>
              </tr>
              <tr>
                <td>
                  Dropdown
                </td>
                <td>
                <SelectInput
            noBlank
            label="A select input example"
            options={["option1", "option2", "option3"]}
            values={["value1", "value2", "value3"]}
            onChange={(e)=>this.onSelectChange(e.target.value)}
          />
                </td>
                <td>
                <p>{this.state.optionValue}</p>
                </td>
              </tr>

              <tr>
                <td> 
                Email input - validates                 
                </td>
                <td>
                  <EmailTextInput label="Enter your email" onChange={ (newEmail : string) =>this.setState( {email: newEmail})} />
                </td>
                <td>
                  <p>Email Value: {this.state.email}</p>                  
                </td>
              </tr>
              <tr>
                <td>
                Select sheet from those you have permission to:
                </td>
                <td>
  
                <SheetSelector
            onSelect={(sheetId) => alert("Added sheet: " + sheetId)}
            dialogTitle="Select sheet to add to this sheetlist"
            openButtonText="Add Sheet+"
            onlyTopLevel={true} // only include top-level sheets
            onInclude={(sheetId, sheetName) => true} // additional filtering 
          /> 
                </td>
                <td>

                </td>
              </tr>


            </table>
        </TableBorders>

        
        


          <Copy>
            <h2>Modal</h2>
          </Copy>
          {this.state.modal && (
            <Modal close={() => this.setState({ modal: false })}>Hello</Modal>
          )}
          <Button onClick={() => this.setState({ modal: true })}>
            Open modal
          </Button>

          <Copy>
            <h2>Loader</h2>
          </Copy>
          {this.state.loading && (
            <FullPageLoadingMessage title="Custom loading title" />
          )}
          <Button
            onClick={() => {
              this.setState({ loading: true });
              setTimeout(() => this.setState({ loading: false }), 2000);
            }}
          >
            Trigger loader (full screen)
          </Button>

          <Copy>
            <h2>Spinner</h2>
          </Copy>
          {this.state.loading2 && <Spinning />}
          <p>Full screen: <Button
            onClick={() => {
              this.setState({ loading2: true });
              setTimeout(() => this.setState({ loading2: false }), 2000);
            }}
          >
            Trigger spinner
          </Button></p>

          <p>Small spinner (for a single div):</p>
          <SpinnerSmall css={undefined} />

        </Panel>

        <Panel>
          <Copy>
            <h2>TabsPanel component</h2>
          </Copy>
          <TabsPanel tabNames={["Tab1", "Tab2", "Tab3"]} initialTab="Tab1">
            <>Tab 1</>
            <>Tab 2</>
            <>Tab 3</>
          </TabsPanel>

          <Copy>
            <h2>Accordion component</h2>
          </Copy>
          <AccordionPanel accordionNames={["Section1", "Section2", "Section3"]}>
            <>Section 1</>
            <>Section 2</>
            <>Section 3</>
          </AccordionPanel>
        </Panel>

        <Panel>
          <Copy>
            <h2>ColumnSelector component</h2>
          </Copy>
          <ColumnSelector OnChange={(column) => alert(column)} />

          <Copy>
            <h2>FieldInputs component</h2>
          </Copy>
          <FieldInputs
            data={this.context._contents}
            Keys={["FirstName", "LastName", "Gender"]}
            Names={["CustomName1", "CustomName2", "CustomName3"]}
          />

          <Copy>
            <h2>ListColumns component</h2>
          </Copy>
          <ListColumns Include={() => true} />

          <Copy>
            <h2>PluginLink component</h2>
          </Copy>
          <PluginLink id="query" />
        </Panel>
      </PluginShell>
    );
  }
}

ReactDOM.render(
  <SheetContainer fetchContents={true} requireTop={false}>
    <App />
  </SheetContainer>,
  document.getElementById("app")
);
