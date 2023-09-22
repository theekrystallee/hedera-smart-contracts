/*-
 *
 * Hedera Smart Contracts
 *
 * Copyright (C) 2023 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import Link from 'next/link';
import { ethers } from 'ethers';
import { FiExternalLink } from 'react-icons/fi';
import { AiOutlineMinus } from 'react-icons/ai';
import { Dispatch, SetStateAction } from 'react';
import { copyContentToClipboard } from '../methods/common';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { IHederaTokenServiceKeyType, TransactionResult } from '@/types/contract-interactions/HTS';
import {
  HEDERA_BRANDING_COLORS,
  HEDERA_CHAKRA_TABLE_VARIANTS,
  HEDERA_CHAKRA_INPUT_BOX_SIZES,
} from '@/utils/common/constants';
import {
  Tr,
  Th,
  Td,
  Table,
  Thead,
  Tbody,
  Popover,
  Tooltip,
  TableContainer,
  PopoverTrigger,
  PopoverContent,
} from '@chakra-ui/react';

/** @dev shared component representing the list of transactions */
interface TransactionResultTablePageProps {
  onOpen?: () => void;
  hederaNetwork: string;
  TRANSACTION_PAGE_SIZE: number;
  currentTransactionPage: number;
  transactionResultStorageKey: string;
  transactionResults: TransactionResult[];
  setTokenInfoFromTxResult?: Dispatch<any>;
  paginatedTransactionResults: TransactionResult[];
  setShowTokenInfo?: Dispatch<SetStateAction<boolean>>;
  setAPIMethodsFromTxResult?: Dispatch<SetStateAction<any>>;
  setCurrentTransactionPage: Dispatch<SetStateAction<number>>;
  setTokenAddressFromTxResult?: Dispatch<SetStateAction<string>>;
  setTransactionResults: Dispatch<SetStateAction<TransactionResult[]>>;
  setKeyTypeFromTxResult?: Dispatch<SetStateAction<IHederaTokenServiceKeyType>>;
  API:
    | 'PRNG'
    | 'GrantKYC'
    | 'TokenMint'
    | 'TokenCreate'
    | 'ExchangeRate'
    | 'QueryValidity'
    | 'CryptoTransfer'
    | 'TokenAssociate'
    | 'TransferSingle'
    | 'QueryTokenStatus'
    | 'QuerySpecificInfo'
    | 'QueryTokenPermission'
    | 'QueryTokenGeneralInfo';
}

export const TransactionResultTable = ({
  API,
  onOpen,
  hederaNetwork,
  setShowTokenInfo,
  transactionResults,
  setTransactionResults,
  TRANSACTION_PAGE_SIZE,
  currentTransactionPage,
  setKeyTypeFromTxResult,
  setTokenInfoFromTxResult,
  setAPIMethodsFromTxResult,
  setCurrentTransactionPage,
  setTokenAddressFromTxResult,
  transactionResultStorageKey,
  paginatedTransactionResults,
}: TransactionResultTablePageProps) => {
  let beginingHashIndex: number, endingHashIndex: number;
  switch (API) {
    case 'TokenCreate':
    case 'PRNG':
      beginingHashIndex = 15;
      endingHashIndex = -12;
      break;
    case 'TokenMint':
    case 'QuerySpecificInfo':
    case 'QueryTokenPermission':
    case 'QueryTokenGeneralInfo':
      beginingHashIndex = 8;
      endingHashIndex = -4;
      break;
    case 'GrantKYC':
    case 'QueryValidity':
    case 'TokenAssociate':
      beginingHashIndex = 10;
      endingHashIndex = -5;
      break;
    case 'ExchangeRate':
    case 'TransferSingle':
    case 'QueryTokenStatus':
      beginingHashIndex = 4;
      endingHashIndex = -3;
      break;
  }

  return (
    <TableContainer className="flex flex-col gap-3 overflow-x-hidden">
      <Table variant={HEDERA_CHAKRA_TABLE_VARIANTS.simple} size={HEDERA_CHAKRA_INPUT_BOX_SIZES.small}>
        <Thead>
          <Tr>
            <Th color={HEDERA_BRANDING_COLORS.violet} isNumeric className="flex justify-start">
              Index
            </Th>
            <Th color={HEDERA_BRANDING_COLORS.violet}>Status</Th>
            <Th color={HEDERA_BRANDING_COLORS.violet}>Tx hash</Th>
            {API !== 'CryptoTransfer' && API !== 'PRNG' && API !== 'ExchangeRate' && (
              <Th color={HEDERA_BRANDING_COLORS.violet}>{`Token ${
                API !== 'TransferSingle' ? `Address` : ``
              }`}</Th>
            )}
            {API === 'TransferSingle' && <Th color={HEDERA_BRANDING_COLORS.violet}>Sender</Th>}
            {(API === 'TokenMint' || API === 'TransferSingle') && (
              <Th color={HEDERA_BRANDING_COLORS.violet}>Recipient</Th>
            )}
            {API === 'TokenAssociate' && <Th color={HEDERA_BRANDING_COLORS.violet}>Associated Account</Th>}
            {API === 'QueryTokenStatus' && <Th color={HEDERA_BRANDING_COLORS.violet}>Account</Th>}
            {API === 'GrantKYC' && <Th color={HEDERA_BRANDING_COLORS.violet}>KYCed Account</Th>}
            {API === 'QueryValidity' && <Th color={HEDERA_BRANDING_COLORS.violet}>Valid Token</Th>}
            {API === 'QueryTokenStatus' && <Th color={HEDERA_BRANDING_COLORS.violet}>Relation</Th>}
            {(API === 'QueryTokenGeneralInfo' ||
              API === 'QuerySpecificInfo' ||
              API === 'QueryTokenPermission') && <Th color={HEDERA_BRANDING_COLORS.violet}>Token Info</Th>}
            {API === 'PRNG' && <Th color={HEDERA_BRANDING_COLORS.violet}>Seed</Th>}
            {API === 'ExchangeRate' && <Th color={HEDERA_BRANDING_COLORS.violet}>Initial Amount</Th>}
            {API === 'ExchangeRate' && <Th color={HEDERA_BRANDING_COLORS.violet}>Converted Amount</Th>}
            {(API === 'QueryTokenGeneralInfo' ||
              API === 'QuerySpecificInfo' ||
              API === 'QueryTokenPermission' ||
              API === 'QueryTokenStatus' ||
              API === 'TransferSingle' ||
              API === 'ExchangeRate') && <Th color={HEDERA_BRANDING_COLORS.violet}>API called</Th>}
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {paginatedTransactionResults.map((transactionResult, index) => {
            /** @dev handle removing record */
            const handleRemoveRecord = (targetTransactionResult: TransactionResult) => {
              const filteredItems = transactionResults.filter(
                (transactionResult) => targetTransactionResult.txHash !== transactionResult.txHash
              );
              if (filteredItems.length === 0) {
                localStorage.removeItem(transactionResultStorageKey);
              }
              setTransactionResults(filteredItems);
            };

            return (
              <Tr
                key={transactionResult.txHash}
                className={
                  transactionResult.status === 'success' ? 'hover:bg-hedera-green/10' : 'hover:bg-red-400/10'
                }
              >
                {/* index */}
                <Td>
                  <p>{index + (currentTransactionPage - 1) * TRANSACTION_PAGE_SIZE + 1}</p>
                </Td>

                {/* status */}
                <Td>
                  <p
                    className={transactionResult.status === 'success' ? `text-hedera-green` : `text-red-400`}
                  >
                    {transactionResult.status.toUpperCase()}
                  </p>
                </Td>

                {/* transaction hash */}
                <Td className="cursor-pointer">
                  <div className="flex gap-1 items-center">
                    <div onClick={() => copyContentToClipboard(transactionResult.txHash)}>
                      <Popover>
                        <PopoverTrigger>
                          <div className="flex gap-1 items-center">
                            <Tooltip label="click to copy transaction hash">
                              {API === 'CryptoTransfer' ? (
                                transactionResult.txHash
                              ) : (
                                <p>
                                  {transactionResult.txHash.slice(0, beginingHashIndex)}...
                                  {transactionResult.txHash.slice(endingHashIndex)}
                                </p>
                              )}
                            </Tooltip>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent width={'fit-content'} border={'none'}>
                          <div className="bg-secondary px-3 py-2 border-none font-medium">Copied</div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Tooltip
                      label={'Explore this transaction on HashScan'}
                      placement="top"
                      fontWeight={'medium'}
                    >
                      <Link
                        href={`https://hashscan.io/${hederaNetwork}/transaction/${transactionResult.txHash}`}
                        target="_blank"
                      >
                        <FiExternalLink />
                      </Link>
                    </Tooltip>
                  </div>
                </Td>

                {/* token address */}
                {(API === 'TokenCreate' ||
                  API === 'TokenMint' ||
                  API === 'GrantKYC' ||
                  API === 'QueryValidity' ||
                  API === 'QueryTokenGeneralInfo' ||
                  API === 'QuerySpecificInfo' ||
                  API === 'QueryTokenPermission' ||
                  API === 'QueryTokenStatus' ||
                  API === 'TransferSingle') && (
                  <Td className="cursor-pointer">
                    {transactionResult.tokenAddress ? (
                      <div className="flex gap-1 items-center">
                        <div onClick={() => copyContentToClipboard(transactionResult.tokenAddress!)}>
                          <Popover>
                            <PopoverTrigger>
                              <div className="flex gap-1 items-center">
                                <Tooltip label="click to copy token address">
                                  <p>
                                    {transactionResult.tokenAddress.slice(0, beginingHashIndex)}...
                                    {transactionResult.tokenAddress.slice(endingHashIndex)}
                                  </p>
                                </Tooltip>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent width={'fit-content'} border={'none'}>
                              <div className="bg-secondary px-3 py-2 border-none font-medium">Copied</div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Tooltip
                          label={'Explore this token on HashScan'}
                          placement="top"
                          fontWeight={'medium'}
                        >
                          <Link
                            href={`https://hashscan.io/${hederaNetwork}/token/${transactionResult.tokenAddress}`}
                            target="_blank"
                          >
                            <FiExternalLink />
                          </Link>
                        </Tooltip>
                      </div>
                    ) : (
                      <>
                        {`${ethers.ZeroAddress.slice(0, beginingHashIndex)}...${ethers.ZeroAddress.slice(
                          endingHashIndex
                        )}`}
                      </>
                    )}
                  </Td>
                )}

                {/* associated token address */}
                {API === 'TokenAssociate' && (
                  <Td className="cursor-pointer">
                    {transactionResult.tokenAddresses && transactionResult.tokenAddresses.length === 1 ? (
                      <div className="flex gap-1 items-center">
                        <div onClick={() => copyContentToClipboard(transactionResult.tokenAddresses![0])}>
                          <Popover>
                            <PopoverTrigger>
                              <div className="flex gap-1 items-center">
                                <Tooltip label="click to copy token address">
                                  <p>
                                    {transactionResult.tokenAddresses[0].slice(0, beginingHashIndex)}
                                    ...
                                    {transactionResult.tokenAddresses[0].slice(endingHashIndex)}
                                  </p>
                                </Tooltip>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent width={'fit-content'} border={'none'}>
                              <div className="bg-secondary px-3 py-2 border-none font-medium">Copied</div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Tooltip
                          label={'Explore this token on HashScan'}
                          placement="top"
                          fontWeight={'medium'}
                        >
                          <Link
                            href={`https://hashscan.io/${hederaNetwork}/token/${transactionResult.tokenAddresses[0]}`}
                            target="_blank"
                          >
                            <FiExternalLink />
                          </Link>
                        </Tooltip>
                      </div>
                    ) : (
                      <div>
                        <Popover>
                          <PopoverTrigger>
                            <div className="flex gap-1 items-center">
                              <Tooltip label="click to show token addresses">
                                <p>Token Combination</p>
                              </Tooltip>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent
                            width={'fit-content'}
                            border={'none'}
                            className="flex flex-col gap-6 bg-secondary px-4 py-3"
                          >
                            {transactionResult.tokenAddresses?.map((token) => (
                              <div key={token} className="bg-secondary border-none font-medium flex gap-1">
                                <div onClick={() => copyContentToClipboard(token)}>
                                  <Popover>
                                    <PopoverTrigger>
                                      <div className="flex gap-1 items-center">
                                        <Tooltip label="click to copy token address">
                                          <p>
                                            {token.slice(0, beginingHashIndex)}
                                            ...
                                            {token.slice(endingHashIndex)}
                                          </p>
                                        </Tooltip>
                                      </div>
                                    </PopoverTrigger>
                                    <PopoverContent width={'fit-content'} border={'none'}>
                                      <div className="bg-secondary px-3 py-2 border-none font-medium">
                                        Copied
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <Tooltip
                                  label={'Explore this token on HashScan'}
                                  placement="top"
                                  fontWeight={'medium'}
                                >
                                  <Link
                                    href={`https://hashscan.io/${hederaNetwork}/token/${token}`}
                                    target="_blank"
                                  >
                                    <FiExternalLink />
                                  </Link>
                                </Tooltip>
                              </div>
                            ))}
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </Td>
                )}

                {/* Account address */}
                {(API === 'TokenMint' ||
                  API === 'TokenAssociate' ||
                  API === 'GrantKYC' ||
                  API === 'QueryTokenStatus' ||
                  API === 'TransferSingle') && (
                  <Td className="cursor-pointer">
                    {transactionResult.accountAddress ? (
                      <div className="flex gap-1 items-center">
                        <div onClick={() => copyContentToClipboard(transactionResult.accountAddress!)}>
                          <Popover>
                            <PopoverTrigger>
                              <div className="flex gap-1 items-center">
                                <Tooltip label="click to copy recipient address">
                                  <p>
                                    {transactionResult.accountAddress!.slice(0, beginingHashIndex)}
                                    ...
                                    {transactionResult.accountAddress!.slice(endingHashIndex)}
                                  </p>
                                </Tooltip>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent width={'fit-content'} border={'none'}>
                              <div className="bg-secondary px-3 py-2 border-none font-medium">Copied</div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Tooltip
                          label={'Explore this user on HashScan'}
                          placement="top"
                          fontWeight={'medium'}
                        >
                          <Link
                            href={`https://hashscan.io/${hederaNetwork}/account/${transactionResult.accountAddress}`}
                            target="_blank"
                          >
                            <FiExternalLink />
                          </Link>
                        </Tooltip>
                      </div>
                    ) : (
                      <>
                        {API === 'TokenMint'
                          ? 'Treasury Account'
                          : `${ethers.ZeroAddress.slice(0, beginingHashIndex)}...${ethers.ZeroAddress.slice(
                              endingHashIndex
                            )}`}
                      </>
                    )}
                  </Td>
                )}

                {API === 'TransferSingle' && (
                  <Td className="cursor-pointer">
                    <div className="flex gap-1 items-center">
                      <div onClick={() => copyContentToClipboard(transactionResult.receiverAddress!)}>
                        <Popover>
                          <PopoverTrigger>
                            <div className="flex gap-1 items-center">
                              <Tooltip label="click to copy recipient address">
                                <p>
                                  {transactionResult.receiverAddress!.slice(0, beginingHashIndex)}
                                  ...
                                  {transactionResult.receiverAddress!.slice(endingHashIndex)}
                                </p>
                              </Tooltip>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent width={'fit-content'} border={'none'}>
                            <div className="bg-secondary px-3 py-2 border-none font-medium">Copied</div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Tooltip label={'Explore this user on HashScan'} placement="top" fontWeight={'medium'}>
                        <Link
                          href={`https://hashscan.io/${hederaNetwork}/account/${transactionResult.receiverAddress}`}
                          target="_blank"
                        >
                          <FiExternalLink />
                        </Link>
                      </Tooltip>
                    </div>
                  </Td>
                )}

                {/* query - isToken */}
                {API === 'QueryValidity' && (
                  <Td
                    className={`cursor-pointer ${
                      transactionResult.isToken ? `text-hedera-green` : `text-red-400`
                    }`}
                  >
                    {JSON.stringify(transactionResult.isToken).toUpperCase()}
                  </Td>
                )}

                {/* query - token info */}
                {(API === 'QueryTokenGeneralInfo' ||
                  API === 'QuerySpecificInfo' ||
                  API === 'QueryTokenPermission') && (
                  <Td className="cursor-pointer">
                    <div className="flex gap-1 items-center">
                      {typeof transactionResult.tokenInfo !== 'undefined' ? (
                        <div
                          onClick={() => {
                            onOpen!();
                            if (setShowTokenInfo) setShowTokenInfo(true);
                            if (setTokenInfoFromTxResult)
                              setTokenInfoFromTxResult(transactionResult.tokenInfo);
                            if (setAPIMethodsFromTxResult)
                              setAPIMethodsFromTxResult(transactionResult.APICalled);
                            if (setKeyTypeFromTxResult)
                              setKeyTypeFromTxResult(transactionResult.keyTypeCalled);
                            if (setTokenAddressFromTxResult)
                              setTokenAddressFromTxResult(transactionResult.tokenAddress as string);
                          }}
                        >
                          <div className="flex gap-1 items-center">
                            <Tooltip label="click to show token info">
                              <p>Token Info</p>
                            </Tooltip>
                          </div>
                        </div>
                      ) : (
                        <>NULL</>
                      )}
                    </div>
                  </Td>
                )}

                {/* query - token info - Token Relation */}
                {API === 'QueryTokenStatus' && (
                  <Td
                    className={`cursor-pointer ${
                      transactionResult.tokenInfo === 1 ? `text-hedera-green` : `text-red-400`
                    }`}
                  >
                    <div className="flex gap-1 items-center">
                      {typeof transactionResult.tokenInfo !== 'undefined' ? (
                        <div className="flex gap-1 items-center">
                          {JSON.stringify(transactionResult.tokenInfo === 1).toUpperCase()}
                        </div>
                      ) : (
                        <>NULL</>
                      )}
                    </div>
                  </Td>
                )}

                {/* Exchange Rate - Initial Amount */}
                {API === 'ExchangeRate' && (
                  <Td className="cursor-pointer">
                    <p className="w-[9rem]">{transactionResult.initialAmount}</p>
                  </Td>
                )}

                {/* Exchange Rate - ConvertedAmount */}
                {API === 'ExchangeRate' && (
                  <Td className="cursor-pointer">
                    {transactionResult.convertedAmount ? (
                      <p className="w-[9rem]">{transactionResult.convertedAmount}</p>
                    ) : (
                      <>NULL</>
                    )}
                  </Td>
                )}

                {/* PRNG - Pseudo Random Seed */}
                {API === 'PRNG' && (
                  <Td className="cursor-pointer">
                    {transactionResult.pseudoRandomSeed ? (
                      <div className="flex gap-1 items-center">
                        <div onClick={() => copyContentToClipboard(transactionResult.pseudoRandomSeed!)}>
                          <Popover>
                            <PopoverTrigger>
                              <div className="flex gap-1 items-center">
                                <Tooltip label="click to copy seed">
                                  <p>
                                    {transactionResult.pseudoRandomSeed.slice(0, beginingHashIndex)}
                                    ...
                                    {transactionResult.pseudoRandomSeed.slice(endingHashIndex)}
                                  </p>
                                </Tooltip>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent width={'fit-content'} border={'none'}>
                              <div className="bg-secondary px-3 py-2 border-none font-medium">Copied</div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    ) : (
                      <>
                        {`${ethers.ZeroAddress.slice(0, beginingHashIndex)}...${ethers.ZeroAddress.slice(
                          endingHashIndex
                        )}`}
                      </>
                    )}
                  </Td>
                )}

                {/* query - API called */}
                {(API === 'QueryTokenGeneralInfo' ||
                  API === 'QuerySpecificInfo' ||
                  API === 'QueryTokenPermission' ||
                  API === 'QueryTokenStatus' ||
                  API === 'TransferSingle' ||
                  API === 'ExchangeRate') && (
                  <Td>
                    {transactionResult.APICalled ? (
                      <>
                        <p>
                          {transactionResult.APICalled === 'TOKEN_KEYS'
                            ? `${transactionResult.APICalled.replace('TOKEN_', '')}_${
                                transactionResult.keyTypeCalled
                              }`
                            : transactionResult.APICalled === 'DEFAULT_FREEZE_STATUS' ||
                              transactionResult.APICalled === 'DEFAULT_KYC_STATUS'
                            ? transactionResult.APICalled.replace('DEFAULT_', '')
                            : transactionResult.APICalled}
                        </p>
                      </>
                    ) : (
                      <>NULL</>
                    )}
                  </Td>
                )}

                {/* delete button */}
                <Td>
                  <Tooltip label="delete this record" placement="top">
                    <button
                      onClick={() => {
                        handleRemoveRecord(transactionResult);
                      }}
                      className={`border border-white/30 px-1 py-1 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-400 transition duration-300`}
                    >
                      <AiOutlineMinus />
                    </button>
                  </Tooltip>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {/* pagination buttons */}
      <div className="flex gap-3 justify-center items-center">
        <Tooltip label="Return to the previous page">
          <button
            onClick={() => setCurrentTransactionPage((prev) => prev - 1)}
            disabled={currentTransactionPage === 1}
            className={`border rounded-lg border-white/30 text-2xl ${
              currentTransactionPage === 1
                ? 'hover:cursor-not-allowed text-white/30'
                : 'hover:cursor-pointer text-white'
            }`}
          >
            <MdNavigateBefore />
          </button>
        </Tooltip>
        <p className="text-base">{currentTransactionPage}</p>
        <Tooltip label="Proceed to the next page">
          <button
            onClick={() => setCurrentTransactionPage((prev) => prev + 1)}
            disabled={paginatedTransactionResults.length < TRANSACTION_PAGE_SIZE}
            className={`border border-white/30 rounded-lg text-2xl cursor-pointer ${
              paginatedTransactionResults.length < TRANSACTION_PAGE_SIZE
                ? 'hover:cursor-not-allowed text-white/30'
                : 'hover:cursor-pointer text-white'
            }`}
          >
            <MdNavigateNext />
          </button>
        </Tooltip>
      </div>
    </TableContainer>
  );
};