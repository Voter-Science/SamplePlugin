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
import { ToolTip } from "./ToolTip";
import { TimeAgo } from "./timeago";

interface IState {
  modal: boolean;
  loading: boolean;
  loading2: boolean;
}

export class App extends React.Component<{}, IState> {
  static contextType = TRCContext;

  public constructor(props: {}) {
    super(props);

    this.state = {
      modal: false,
      loading: false,
      loading2: false,
    };

    this.onRowClick = this.onRowClick.bind(this);
  }

  private onRowClick(key: string) {
    alert(key);
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
              <ToolTip tooltipText="Total number of unique households (depuded by address/household id)" />
              molestias vel 
              <ToolTip tooltipText="Total number of unique households (depuded by address/household id)" />
              dolores sapiente! Alias, magni? Voluptatem, ut!
              Last Updated: <TimeAgo timeStr={"Wed, 22 Dec 2022 07:00:00 GMT"}/>
            </p>
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
          <TextInput
            label="A text input example"
            placeholder="Type something..."
          />
          <SelectInput
            noBlank
            label="A select input example"
            options={["option1", "option2", "option3"]}
          />

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
            Trigger loader
          </Button>

          <Copy>
            <h2>Spinner</h2>
          </Copy>
          {this.state.loading2 && <Spinning />}
          <Button
            onClick={() => {
              this.setState({ loading2: true });
              setTimeout(() => this.setState({ loading2: false }), 2000);
            }}
          >
            Trigger spinner
          </Button>
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
            <h2>FiledInputs component</h2>
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
