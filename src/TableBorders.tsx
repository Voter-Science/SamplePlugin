import styled from "@emotion/styled";

// Wrap a <table> control to add borders and basic styling. 


// https://stackoverflow.com/questions/69344055/how-can-i-add-a-border-to-my-table-tr-th-and-td-elements-in-my-styled-react-c
// apply to Table "table td" applies to all descendent <td> in the table.
export const TableBorders = styled.div`
  border: 1px solid black;

  > table, table td {
      border: 1px solid black;
  }`;
