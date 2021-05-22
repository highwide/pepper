import { Box } from "@chakra-ui/layout";
import { Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/table";
import { useState } from "react";

const KoshohyoNewPage = () => {
  const [columnLength, setColumnLength] = useState(1);
  const [rowLength, setRowLength] = useState(1);

  let header = [<Th>/</Th>];
  for (let i = 0; i < columnLength; i++) {
    header.push(<Th>...</Th>);
  }
  let rows = [];
  for (let i = 0; i < rowLength; i++) {
    rows.push(
      <Tr>
        <Td>呼ぶ側</Td>
      </Tr>
    );
  }

  return (
    <Box>
      <div>
        <button
          title={"列を増やす"}
          onClick={() => setColumnLength((prev) => prev + 1)}
        />
        <button
          title={"行を増やす"}
          onClick={() => setRowLength((prev) => prev + 1)}
        />
      </div>
      <Table>
        <Thead>
          <Tr>{header}</Tr>
        </Thead>
        <Tbody></Tbody>
      </Table>
    </Box>
  );
};

export default KoshohyoNewPage;
