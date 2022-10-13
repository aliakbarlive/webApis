const { SpRequest, SyncRecord } = require('../../models');

const {
  saveShipmentEvents,
  saveRefundEvents,
  saveChargebackEvents,
  saveGuaranteeClaimEvents,
  savePayWithAmazonEvents,
  saveSolutionProviderCreditEvents,
  saveRetroChargeEvents,
  saveRentalTransactionEvents,
  saveProductAdsPaymentEvents,
  saveServiceFeeEvents,
  saveSellerDealPaymentEvents,
  saveDebtRecoveryEvents,
  saveLoanServicingEventLists,
  saveAdjustmentEvents,
  saveSafetReimbursementEvents,
  saveSellerReviewEnrollmentPaymentEvents,
  saveFbaLiquidationEvents,
  saveCouponPaymentEvents,
  saveImagingServicesFeeEvents,
  saveNetworkComminglingTransactionEvents,
  saveRemovalShipmentEvents,
  saveAffordabilityExpenseEvents,
  saveAffordabilityExpenseReversalEvents,
} = require('./saveData/index.js');

module.exports = async (FinancialEvents, accountId, page, spRequestId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const spRequest = await SpRequest.findByPk(spRequestId, {
        include: {
          model: SyncRecord,
          as: 'syncRecord',
        },
      });

      const {
        ShipmentEventList,
        RefundEventList,
        GuaranteeClaimEventList,
        ChargebackEventList,
        PayWithAmazonEventList,
        SolutionProviderCreditEventList,
        RetrochargeEventList,
        RentalTransactionEventList,
        ProductAdsPaymentEventList,
        ServiceFeeEventList,
        SellerDealPaymentEventList,
        DebtRecoveryEventList,
        LoanServicingEventList,
        AdjustmentEventList,
        SAFETReimbursementEventList,
        SellerReviewEnrollmentPaymentEventList,
        FBALiquidationEventList,
        CouponPaymentEventList,
        ImagingServicesFeeEventList,
        NetworkComminglingTransactionEventList,
        AffordabilityExpenseEventList,
        AffordabilityExpenseReversalEventList,
        RemovalShipmentEventList,
      } = FinancialEvents;

      if (ShipmentEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${ShipmentEventList.length} shipment events of page ${page}.`,
        });

        await saveShipmentEvents(ShipmentEventList, accountId);
      }
      if (RefundEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${RefundEventList.length} refund events of page ${page}.`,
        });

        await saveRefundEvents(RefundEventList, accountId);
      }
      if (GuaranteeClaimEventList && GuaranteeClaimEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${GuaranteeClaimEventList.length} guarantee claim events of page ${page}.`,
        });
        await saveGuaranteeClaimEvents(ChargebackEventList, accountId);
      }
      if (ChargebackEventList && ChargebackEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${ChargebackEventList.length} charge back events of page ${page}.`,
        });
        await saveChargebackEvents(ChargebackEventList, accountId);
      }
      if (PayWithAmazonEventList && PayWithAmazonEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${PayWithAmazonEventList.length} pay with amazon events of page ${page}.`,
        });
        await savePayWithAmazonEvents(PayWithAmazonEventList, accountId);
      }
      if (
        SolutionProviderCreditEventList &&
        SolutionProviderCreditEventList.length > 0
      ) {
        await spRequest.update({
          message: `Saving ${SolutionProviderCreditEventList.length} service provider credit events of page ${page}.`,
        });
        await saveSolutionProviderCreditEvents(
          SolutionProviderCreditEventList,
          accountId
        );
      }
      if (RetrochargeEventList && RetrochargeEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${RetrochargeEventList.length} retrocharge events of page ${page}.`,
        });
        await saveRetroChargeEvents(RetrochargeEventList, accountId);
      }
      if (RentalTransactionEventList && RentalTransactionEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${RentalTransactionEventList.length} rental transaction events of page ${page}.`,
        });
        await saveRentalTransactionEvents(
          RentalTransactionEventList,
          accountId
        );
      }
      if (ProductAdsPaymentEventList && ProductAdsPaymentEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${ProductAdsPaymentEventList.length} product ads payment events of page ${page}.`,
        });
        await saveProductAdsPaymentEvents(
          ProductAdsPaymentEventList,
          accountId
        );
      }
      if (ServiceFeeEventList && ServiceFeeEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${ServiceFeeEventList.length} service fee events of page ${page}.`,
        });
        await saveServiceFeeEvents(ServiceFeeEventList, accountId);
      }
      if (SellerDealPaymentEventList && SellerDealPaymentEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${SellerDealPaymentEventList.length} seller deal events of page ${page}.`,
        });
        await saveSellerDealPaymentEvents(
          SellerDealPaymentEventList,
          accountId
        );
      }
      if (DebtRecoveryEventList && DebtRecoveryEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${DebtRecoveryEventList.length} debt recovery events of page ${page}.`,
        });
        await saveDebtRecoveryEvents(DebtRecoveryEventList, accountId);
      }
      if (LoanServicingEventList && LoanServicingEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${LoanServicingEventList.length} loan servicing events of page ${page}.`,
        });
        await saveLoanServicingEventLists(LoanServicingEventList, accountId);
      }
      if (AdjustmentEventList && AdjustmentEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${AdjustmentEventList.length} adjustment events of page ${page}.`,
        });
        await saveAdjustmentEvents(AdjustmentEventList, accountId);
      }
      if (
        SAFETReimbursementEventList &&
        SAFETReimbursementEventList.length > 0
      ) {
        await spRequest.update({
          message: `Saving ${SAFETReimbursementEventList.length} safet reimbursement events of page ${page}.`,
        });
        await saveSafetReimbursementEvents(
          SAFETReimbursementEventList,
          accountId
        );
      }
      if (
        SellerReviewEnrollmentPaymentEventList &&
        SellerReviewEnrollmentPaymentEventList.length > 0
      ) {
        await spRequest.update({
          message: `Saving ${SellerReviewEnrollmentPaymentEventList.length} seller review enrollment payment events of page ${page}.`,
        });
        await saveSellerReviewEnrollmentPaymentEvents(
          SellerReviewEnrollmentPaymentEventList,
          accountId
        );
      }
      if (FBALiquidationEventList && FBALiquidationEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${FBALiquidationEventList.length} fba liquidation events of page ${page}.`,
        });
        await saveFbaLiquidationEvents(FBALiquidationEventList, accountId);
      }
      if (CouponPaymentEventList && CouponPaymentEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${CouponPaymentEventList.length} coupon payment events of page ${page}.`,
        });
        await saveCouponPaymentEvents(CouponPaymentEventList, accountId);
      }
      if (
        ImagingServicesFeeEventList &&
        ImagingServicesFeeEventList.length > 0
      ) {
        await spRequest.update({
          message: `Saving ${ImagingServicesFeeEventList.length} imaging services fee events of page ${page}.`,
        });
        await saveImagingServicesFeeEvents(
          ImagingServicesFeeEventList,
          accountId
        );
      }
      if (
        NetworkComminglingTransactionEventList &&
        NetworkComminglingTransactionEventList.length > 0
      ) {
        await spRequest.update({
          message: `Saving ${NetworkComminglingTransactionEventList.length} network commingling transaction events of page ${page}.`,
        });
        await saveNetworkComminglingTransactionEvents(
          NetworkComminglingTransactionEventList,
          accountId
        );
      }
      if (
        AffordabilityExpenseEventList &&
        AffordabilityExpenseEventList.length > 0
      ) {
        await spRequest.update({
          message: `Saving ${AffordabilityExpenseEventList.length} affordability expense events of page ${page}.`,
        });
        await saveAffordabilityExpenseEvents(
          AffordabilityExpenseEventList,
          accountId
        );
      }
      if (
        AffordabilityExpenseReversalEventList &&
        AffordabilityExpenseReversalEventList.length > 0
      ) {
        await spRequest.update({
          message: `Saving ${AffordabilityExpenseReversalEventList.length} affordability expense reversal events of page ${page}.`,
        });
        await saveAffordabilityExpenseReversalEvents(
          AffordabilityExpenseReversalEventList,
          accountId
        );
      }
      if (RemovalShipmentEventList && RemovalShipmentEventList.length > 0) {
        await spRequest.update({
          message: `Saving ${RemovalShipmentEventList.length} removal shipment events of page ${page}.`,
        });
        await saveRemovalShipmentEvents(RemovalShipmentEventList, accountId);
      }

      return resolve(FinancialEvents);
    } catch (error) {
      return reject(
        new Error(
          `Something went wrong on saving the financial events. ${error.message}`
        )
      );
    }
  });
};
