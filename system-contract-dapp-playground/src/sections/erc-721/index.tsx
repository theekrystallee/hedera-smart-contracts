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

'use client';

import ContractInteraction from '@/components/contract-interaction';
import { HEDERA_SMART_CONTRACTS_ASSETS } from '@/utils/constants';
import { Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BsGithub } from 'react-icons/bs';
import { IoOpenOutline } from 'react-icons/io5';

const ERC721Section = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{
        delay: 0.3,
        duration: 0.6,
      }}
      viewport={{ once: true }}
      className="text-white w-full flex pt-7 pb-12 pl-7 flex-col gap-9"
    >
      {/* top part */}
      <div className="flex flex-col gap-6">
        {/* TITLE */}
        <h1 className="text-[1.88rem] font-medium leading-10 flex gap-1 whitespace-nowrap">
          Non-Fungible Token
          <div className="flex">
            (
            <Link
              href={`https://eips.ethereum.org/EIPS/eip-721`}
              target="_blank"
              className="hover:underline flex gap-1 items-center"
            >
              <p>ERC-721</p>
              <div className="text-2xl">
                <IoOpenOutline />
              </div>
            </Link>
            )
          </div>
        </h1>

        {/* content */}
        <div>
          {/* Overview */}
          <div className="text-[1.65rem] font-medium">Overview</div>

          {/* content */}
          <div className="tracking-tight text-white/70">
            The implementation of a standard API for NFTs within smart contracts. This standard
            provides basic functionality to create, mint, track and transfer NFTs.
          </div>
        </div>
      </div>

      {/* Contract */}
      <div className="flex flex-col">
        <div className="flex flex-col gap-6 w-full">
          {/* title */}
          <div className="flex gap-1 items-center text-[20px]">
            {/* title */}
            <p>{HEDERA_SMART_CONTRACTS_ASSETS.ERC_721.title}</p>

            {/* Github icon */}
            <Tooltip label="Visit source code on Github." placement={'top'}>
              <Link
                href={HEDERA_SMART_CONTRACTS_ASSETS.ERC_721.githubUrl}
                target="_blank"
                className="text-2xl"
              >
                <BsGithub />
              </Link>
            </Tooltip>
          </div>

          {/* contract interaction component */}
          <ContractInteraction contract={HEDERA_SMART_CONTRACTS_ASSETS.ERC_721} />
        </div>
      </div>
    </motion.section>
  );
};

export default ERC721Section;