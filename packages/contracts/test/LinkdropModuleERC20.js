/* global describe, before, it */

import chai, { expect } from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import { ethers } from 'ethers'
import { createLink, signReceiverAddress } from './utils'

import TokenMock from '../build/TokenMock'
import CreateAndAddModules from '../build/CreateAndAddModules'
import ProxyFactory from '../build/ProxyFactory'
import GnosisSafe from '../build/GnosisSafe'
import LinkdropModule from '../build/LinkdropModule'
import * as utils from './utils'
import { BigNumber } from 'ethers/utils'

ethers.errors.setLogLevel('error')
chai.use(solidity)

const ADDRESS_ZERO = ethers.constants.AddressZero
const ZERO_BYTES = '0x'
const ZERO = 0

const provider = createMockProvider()

let [deployer, firstOwner, secondOwner, linkdropSigner] = getWallets(provider)

let gnosisSafe, linkdropModule, modules

let tokenInstance

let link
let receiverAddress
let receiverSignature
let weiAmount
let tokenAddress
let tokenAmount

let expiration

describe('Linkdrop Module Tests', () => {
  //
  describe('Connection to Gnosis Safe', () => {
    before(async () => {
      tokenInstance = await deployContract(deployer, TokenMock)

      let proxyFactory = await deployContract(deployer, ProxyFactory)

      let createAndAddModules = await deployContract(
        deployer,
        CreateAndAddModules
      )

      let gnosisSafeMasterCopy = await deployContract(
        deployer,
        GnosisSafe,
        [],
        {
          gasLimit: 6500000
        }
      )

      // Initialize Safe master copy
      await gnosisSafeMasterCopy.setup(
        [firstOwner.address, secondOwner.address], // owners
        2, // treshold
        ADDRESS_ZERO, // to
        ZERO_BYTES, // data,
        ADDRESS_ZERO, // payment token address
        ZERO, // payment amount
        ADDRESS_ZERO // payment receiver address
      )

      const linkdropModuleMasterCopy = await deployContract(
        deployer,
        LinkdropModule
      )

      const moduleData = utils.getData(linkdropModuleMasterCopy, 'setup', [
        [linkdropSigner.address]
      ])

      const proxyFactoryData = utils.getData(proxyFactory, 'createProxy', [
        linkdropModuleMasterCopy.address,
        moduleData
      ])

      const modulesCreationData = utils.createAndAddModulesData([
        proxyFactoryData
      ])

      const createAndAddModulesData = utils.getData(
        createAndAddModules,
        'createAndAddModules',
        [proxyFactory.address, modulesCreationData]
      )

      const gnosisSafeData = utils.getData(gnosisSafeMasterCopy, 'setup', [
        [firstOwner.address, secondOwner.address], // owners
        2, // treshold
        createAndAddModules.address, // to
        createAndAddModulesData, // data,
        ADDRESS_ZERO, // payment token address
        ZERO, // payment amount
        ADDRESS_ZERO // payment receiver address
      ])

      const proxy = await utils.getParamFromTxEvent(
        await proxyFactory.createProxy(
          gnosisSafeMasterCopy.address,
          gnosisSafeData,
          { gasLimit: 6500000 }
        ), // tx
        'ProxyCreation', // eventName
        'proxy', // paramName
        proxyFactory // contract
      )

      gnosisSafe = new ethers.Contract(proxy, GnosisSafe.abi, provider)

      modules = await gnosisSafe.getModules()

      linkdropModule = new ethers.Contract(
        modules[0],
        LinkdropModule.abi,
        deployer
      )
    })

    it('should connect linkdrop module to gnosis safe', async () => {
      expect(await linkdropModule.manager()).to.equal(gnosisSafe.address)
    })
  })

  describe('ERC20 functionality', () => {
    it('should revert with unsufficient amount of ethers', async () => {
      weiAmount = 10000
      tokenAddress = tokenInstance.address
      tokenAmount = 25
      expiration = 12345678910

      link = await createLink(
        linkdropSigner,
        weiAmount,
        tokenAddress,
        tokenAmount,
        expiration
      )

      receiverAddress = ethers.Wallet.createRandom().address
      receiverSignature = await signReceiverAddress(
        link.linkKey,
        receiverAddress
      )

      await expect(
        linkdropModule.checkLinkParams(
          weiAmount,
          tokenAddress,
          tokenAmount,
          expiration,
          link.linkId,
          link.linkdropSignerSignature,
          receiverAddress,
          receiverSignature
        )
      ).to.be.revertedWith('Insufficient amount of ethers')
    })

    it('should topup gnosis safe with ethers', async () => {
      const weiBalanceBefore = await provider.getBalance(gnosisSafe.address)
      let amount = ethers.utils.parseEther('2')
      await firstOwner.sendTransaction({
        to: gnosisSafe.address,
        value: amount
      })
      const weiBalanceAfter = await provider.getBalance(gnosisSafe.address)
      expect(weiBalanceAfter).to.eq(weiBalanceBefore + amount)
    })

    it('should revert with unsufficient amount of tokens', async () => {
      await expect(
        linkdropModule.checkLinkParams(
          weiAmount,
          tokenAddress,
          tokenAmount,
          expiration,
          link.linkId,
          link.linkdropSignerSignature,
          receiverAddress,
          receiverSignature
        )
      ).to.be.revertedWith('Insufficient amount of tokens')
    })

    it('should topup gnosis safe with tokens', async () => {
      const tokenBalanceBefore = await tokenInstance.balanceOf(
        gnosisSafe.address
      )
      let amount = 100000
      await tokenInstance.transfer(gnosisSafe.address, amount)
      const tokenBalanceAfter = await tokenInstance.balanceOf(
        gnosisSafe.address
      )
      expect(tokenBalanceAfter).to.eq(tokenBalanceBefore + amount)
    })

    it('should successfully claim ethers and tokens', async () => {
      const receiverWeiBalanceBefore = await provider.getBalance(
        receiverAddress
      )
      const receiverTokenBalanceBefore = await tokenInstance.balanceOf(
        receiverAddress
      )

      const gnosisSafeWeiBalanceBefore = await provider.getBalance(
        gnosisSafe.address
      )
      const gnosisSafeTokenBalanceBefore = await tokenInstance.balanceOf(
        gnosisSafe.address
      )

      await linkdropModule.claimLink(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expiration,
        link.linkId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature
      )

      const receiverWeiBalanceAfter = await provider.getBalance(receiverAddress)
      const receiverTokenBalanceAfter = await tokenInstance.balanceOf(
        receiverAddress
      )

      const gnosisSafeWeiBalanceAfter = await provider.getBalance(
        gnosisSafe.address
      )
      const gnosisSafeTokenBalanceAfter = await tokenInstance.balanceOf(
        gnosisSafe.address
      )

      expect(receiverWeiBalanceAfter).to.eq(
        receiverWeiBalanceBefore + weiAmount
      )
      expect(receiverTokenBalanceAfter).to.eq(
        receiverTokenBalanceBefore + tokenAmount
      )

      expect(gnosisSafeWeiBalanceAfter).to.eq(
        new BigNumber(gnosisSafeWeiBalanceBefore).sub(weiAmount)
      )
      expect(gnosisSafeTokenBalanceAfter).to.eq(
        new BigNumber(gnosisSafeTokenBalanceBefore).sub(tokenAmount)
      )
    })

    it('should fail to claim the same link twice', async () => {
      await expect(
        linkdropModule.claimLink(
          weiAmount,
          tokenAddress,
          tokenAmount,
          expiration,
          link.linkId,
          link.linkdropSignerSignature,
          receiverAddress,
          receiverSignature
        )
      ).to.be.revertedWith('Claimed link')
    })

    it('should fail to claim an expired link', async () => {
      const expiredTimestamp = 0

      link = await createLink(
        linkdropSigner,
        weiAmount,
        tokenAddress,
        tokenAmount,
        expiration
      )

      receiverAddress = ethers.Wallet.createRandom().address
      receiverSignature = await signReceiverAddress(
        link.linkKey,
        receiverAddress
      )

      await expect(
        linkdropModule.checkLinkParams(
          weiAmount,
          tokenAddress,
          tokenAmount,
          expiredTimestamp,
          link.linkId,
          link.linkdropSignerSignature,
          receiverAddress,
          receiverSignature
        )
      ).to.be.revertedWith('Expired link')
    })

    it('should fail to claim link with fake linkdrop signer signature', async () => {
      let fakeSignature = await deployer.signMessage('Fake message')

      await expect(
        linkdropModule.checkLinkParams(
          weiAmount,
          tokenAddress,
          tokenAmount,
          expiration,
          link.linkId,
          fakeSignature,
          receiverAddress,
          receiverSignature
        )
      ).to.be.revertedWith('Invalid linkdrop signer signature')
    })

    it('should fail to claim link with fake receiver signature', async () => {
      let fakeLink = await createLink(
        linkdropSigner,
        weiAmount,
        tokenAddress,
        tokenAmount,
        expiration
      )

      receiverAddress = ethers.Wallet.createRandom().address
      let fakeReceiverSignature = await signReceiverAddress(
        fakeLink.linkKey,
        receiverAddress
      )

      await expect(
        linkdropModule.checkLinkParams(
          weiAmount,
          tokenAddress,
          tokenAmount,
          expiration,
          link.linkId,
          link.linkdropSignerSignature,
          receiverAddress,
          fakeReceiverSignature
        )
      ).to.be.revertedWith('Invalid receiver signature')
    })

    it('should mark link as canceled from owner account', async () => {
      link = await createLink(
        linkdropSigner,
        weiAmount,
        tokenAddress,
        tokenAmount,
        expiration
      )

      linkdropModule = linkdropModule.connect(firstOwner)

      await expect(
        linkdropModule.cancel(link.linkId, { gasLimit: 200000 })
      ).to.emit(linkdropModule, 'Canceled')
      let canceled = await linkdropModule.isCanceledLink(link.linkId)
      expect(canceled).to.eq(true)
    })

    it('should fail to claim canceled link', async () => {
      await expect(
        linkdropModule.claimLink(
          weiAmount,
          tokenAddress,
          tokenAmount,
          expiration,
          link.linkId,
          link.linkdropSignerSignature,
          receiverAddress,
          receiverSignature
        )
      ).to.be.revertedWith('Canceled link')
    })
  })
})
