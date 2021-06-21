import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Container } from "@chakra-ui/layout";
import { Table, Tr, Tbody, Td } from "@chakra-ui/table";
import { Button, Text, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

import React, { useReducer, useState, useEffect } from "react";
import EditableCell from "../components/EditableCell";
import html2canvas from "html2canvas";

type Naming = {
  callee: string;
  name: string;
};
type HowToCall = {
  caller: string;
  error?: string;
  namings: Naming[];
};
type newPageState = {
  addingName: string;
  howToCalls: HowToCall[];
  error?: string;
};
const initialState: newPageState = {
  addingName: "",
  howToCalls: [],
};

const ActionTypes = {
  INPUT_NAME: "INPUT_NAME",
  SUBMIT_NAME: "SUBMIT_NAME",
  EDIT_NAME: "EDIT_NAME",
  REMOVE_NAME: "REMOVE_NAME",
  SUBMIT_HOW_TO_CALL: "SUBMIT_HOW_TO_CALL",
} as const;

type Action = {
  type: keyof typeof ActionTypes;
  payload: {
    caller?: string;
    callee?: string;
    name?: string;
  };
};
const submitName = (state: newPageState, action: Action) => {
  const callers = state.howToCalls.map((howToCall) => {
    return howToCall.caller;
  });
  const caller = action.payload.caller;
  if (!caller || callers.includes(caller)) {
    return { ...state, error: `${caller}はすでに登録されています` };
  }
  return {
    ...state,
    addingName: "",
    error: "",
    howToCalls: [...state.howToCalls, { caller, namings: [] }],
  };
};

const editName = (state: newPageState, action: Action) => {
  const i = state.howToCalls.findIndex((howToCall) => {
    return howToCall.caller === action.payload.caller;
  });
  if (i === -1) {
    return state;
  }

  const target = state.howToCalls[i];
  const caller = action.payload.caller;
  const callers = state.howToCalls.map((howToCall) => {
    return howToCall.caller;
  });
  if (
    caller &&
    callers.filter((c) => {
      return c === caller;
    }).length > 1
  ) {
    return { ...state, error: `${caller}はすでに登録されています` };
  }
  let dup: newPageState = initialState;
  dup = Object.assign(dup, state);
  dup.howToCalls.splice(i, 1, target);
  return { ...state, ...dup };
};

const removeName = (state: newPageState, action: Action) => {
  const i = state.howToCalls.findIndex((howToCall) => {
    return howToCall.caller === action.payload.caller;
  });
  if (i === -1) {
    throw new Error();
  }
  let dup: newPageState = initialState;
  dup = Object.assign(dup, state);
  dup.howToCalls.splice(i, 1);
  return { ...state, ...dup };
};

const submitHowToCall = (state: newPageState, action: Action) => {
  if (
    !action.payload.caller ||
    !action.payload.callee ||
    !action.payload.name
  ) {
    throw new Error();
  }
  let dup: newPageState = initialState;
  dup = Object.assign(dup, state);

  const howToCallIndex = state.howToCalls.findIndex((howToCall) => {
    return howToCall.caller === action.payload.caller;
  });
  const namingIndex = state.howToCalls[howToCallIndex].namings.findIndex(
    (naming) => {
      return naming.callee === action.payload.callee;
    }
  );
  dup.howToCalls[howToCallIndex].namings.splice(namingIndex, 1, {
    callee: action.payload.callee,
    name: action.payload.name,
  });

  return { ...state, ...dup };
};

const reducer = (state: newPageState, action: Action) => {
  switch (action.type) {
    case ActionTypes.INPUT_NAME:
      return {
        ...state,
        addingName: action.payload.caller || "",
      };
    case ActionTypes.SUBMIT_NAME:
      return submitName(state, action);
    case ActionTypes.EDIT_NAME:
      return editName(state, action);
    case ActionTypes.REMOVE_NAME:
      return removeName(state, action);
    case ActionTypes.SUBMIT_HOW_TO_CALL:
      return submitHowToCall(state, action);
    default:
      throw new Error();
  }
};

const KoshohyoNewPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleNameInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionTypes.INPUT_NAME,
      payload: { caller: e.currentTarget.value },
    });
  };

  const handleNameInputSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({
      type: ActionTypes.SUBMIT_NAME,
      payload: { caller: state.addingName },
    });
  };

  const [downloadURL, setDownloadURL] = useState("");

  const generateImageURL = async () => {
    // FIXME: Don't use getElementById on React
    const tableElement = document.getElementById("koshohyo-table");
    if (tableElement) {
      const canvas = await html2canvas(tableElement);
      setDownloadURL(canvas.toDataURL());
    } else {
      return "";
    }
  };
  useEffect(() => {
    generateImageURL();
  });

  return (
    <Container maxW="container.xl">
      <Text m="8" fontSize="4xl">
        呼称表ジェネレーター(α)
      </Text>
      <Table
        id="koshohyo-table"
        variant="striped"
        type="whiteAlpha"
        size="md"
        overflowX="scroll"
      >
        <Tbody>
          <Tr>
            <Td w="240px">呼ぶ側 \ 呼ばれる側</Td>
            {state.howToCalls.map((howToCall, i) => {
              return (
                <Td maxW="240px" key={i}>
                  {howToCall.caller}
                </Td>
              );
            })}
          </Tr>
          {state.howToCalls.map((howTocall, i) => {
            return (
              <Tr key={i}>
                <Td d="flex" justifyContent="space-between" alignItems="center">
                  <EditableCell
                    defaultValue={howTocall.caller}
                    onSubmit={(caller: string) => {
                      dispatch({
                        type: ActionTypes.EDIT_NAME,
                        payload: { caller },
                      });
                    }}
                  />
                  <IconButton
                    mr="4"
                    aria-label="close"
                    size="xs"
                    colorScheme="blackAlpha"
                    icon={<CloseIcon />}
                    onClick={() => {
                      dispatch({
                        type: ActionTypes.REMOVE_NAME,
                        payload: { caller: howTocall.caller },
                      });
                    }}
                  />
                </Td>
                {state.howToCalls.map((_, j) => {
                  return (
                    <Td key={j}>
                      <EditableCell
                        defaultValue="..."
                        onSubmit={(name: string) => {
                          dispatch({
                            type: ActionTypes.SUBMIT_HOW_TO_CALL,
                            payload: {
                              caller: howTocall.caller,
                              callee: state.howToCalls[j].caller,
                              name,
                            },
                          });
                        }}
                      />
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Box my="24px">
        <form onSubmit={handleNameInputSubmit}>
          <FormControl isInvalid={!!state.error}>
            <FormLabel>名前を追加する</FormLabel>
            <Input
              onChange={handleNameInputChange}
              value={state.addingName}
              placeholder="名前を追加"
              size="sm"
              maxW="240px"
            />
            {state.error && <FormErrorMessage>{state.error}</FormErrorMessage>}
          </FormControl>
        </form>
      </Box>
      {state.howToCalls.length > 0 && (
        <Button>
          <a href={downloadURL} download="koshohyo.png">
            呼称表画像をダウンロード
          </a>
        </Button>
      )}
    </Container>
  );
};

export default KoshohyoNewPage;
