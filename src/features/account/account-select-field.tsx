import { Suspense } from 'react'
import tw from 'twin.macro'
import { HiChevronDown as ChevronDownIcon, HiOutlineCheck as CheckIcon } from 'react-icons/hi'
import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  Spinner,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react'

import { accountsAtom, extensionEnabledAtom, lastSelectedAccountAtom } from './atoms'

function AccountSelectFieldBase() {
  const enabled = useAtomValue(extensionEnabledAtom)
  const accounts = useAtomValue(accountsAtom)
  const [selected, setSelected] = useAtom(lastSelectedAccountAtom)
  let placeholder = 'Please Select Account First'
  if (selected && selected.meta && selected.meta.name) {
    placeholder = selected.meta.name
  } else if (accounts.length === 0) {
    placeholder = 'Please Add Account First'
  }
  if (!enabled) {
    return null
  }
  return (
    <Menu>
      <MenuButton tw="w-full border border-solid border-black" as={Button} rightIcon={<ChevronDownIcon />}>
        {placeholder}
      </MenuButton>
      {(accounts.length !== 0) && (
        <MenuList>
          {accounts.map(account => (
            <MenuItem
            key={account.meta.name}
              onClick={() => setSelected(account)}
            >
              <MenuItemOption
                icon={<CheckIcon tw="text-phala-500" />}
                isChecked={account.address === selected?.address}
              >
                <span tw="text-white">{account.meta.name}</span>
                <code tw="ml-1 font-mono text-xs text-gray-500">
                  ({account.address.substring(0, 6)}...{account.address.substring(account.address.length - 6)})
                </code>
              </MenuItemOption>
            </MenuItem>
          ))}
        </MenuList>
      )}
    </Menu>
  )
}

function ExtensionRequiredHelpText() {
  const enabled = useAtomValue(extensionEnabledAtom)
  if (enabled) {
    return null
  }
  return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle mr={2}>You need install Polkadot{"{.js}"} extension first.</AlertTitle>
      <AlertDescription>
        <a href="https://wiki.phala.network/en-us/general/applications/01-polkadot-extension/" target="_blank" tw="text-blue-500 underline">
          read more
        </a>
      </AlertDescription>
    </Alert>
  )
}

function CreateAccountHelpText() {
  const enabled = useAtomValue(extensionEnabledAtom)
  const accounts = useAtomValue(accountsAtom)
  if (!enabled || accounts.length > 0) {
    return null
  }
  return (
    <FormHelperText tw="text-[#666] px-4">
      Don't have account yet? Create yours.
      <a href="https://wiki.phala.network/en-us/general/applications/01-polkadot-extension/#create-new-account" target="_blank" tw="ml-2 text-blue-500 underline">
        read more
      </a>
    </FormHelperText>
  )
}

function AccountSelectField() {
  return (
    <FormControl>
      <FormLabel tw="bg-[#000] text-phala-500 p-4 w-full">Account</FormLabel>
      <div tw="w-full px-4 mt-4">
        <Suspense fallback={<Button tw="w-full flex items-center justify-center"><Spinner /></Button>}>
          <ExtensionRequiredHelpText />
          <AccountSelectFieldBase />
        </Suspense>
      </div>
      <Suspense fallback={<div />}>
        <CreateAccountHelpText />
      </Suspense>
    </FormControl>
  )
}

export default AccountSelectField