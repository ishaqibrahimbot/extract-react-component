import React from "react";
import css from "./MyOrders.module.css";
import ReactPaginate from "react-paginate";
import { getShippingAddress, ViewProps } from ".";
import LoadingDots from "@components/loading-dots/LoadingDots";
import Error from "@components/common/Error/Error";
import { processAndDownloadCsvData } from "../..";
import { ORDER_TRACKING_URL } from "@utils/aws-services";
import { NewComponent } from "./NewComponent";

const DesktopView: React.FC<ViewProps> = ({
  className,
  setOrderInformation,
  isLoaded,
  error,
  orders,
  setOrders,
  isLoading,
  title,
}) => {
  return (
    <div className={`${css.container} ${className}`}>
      <NewComponent title={title} />
      <div>
        <table className={css.table}>
          <tr>
            {["Order#", "Date", "Total", "Status", "Ship to", "", ""].map(
              (item, index) => {
                return (
                  <td
                    key={index}
                    className={
                      "pl-1.5 leading-5.5 tracking-h2 text-primary font-medium text-medium font-inter py-3.5"
                    }
                  >
                    {item}
                  </td>
                );
              }
            )}
          </tr>
          {isLoaded &&
            orders &&
            !!orders.total &&
            !error &&
            orders.data
              .slice(orders.offset, orders.offset + orders.limit)
              .map((order: any, number: number) => {
                return (
                  <tr key={number}>
                    <td
                      onClick={() => setOrderInformation(order)}
                      className={
                        "pl-1.5 underline cursor-pointer text-brand leading-5.5 tracking-h2 text-medium font-inter  py-3.5"
                      }
                    >
                      {order?.tranid}
                    </td>
                    <td
                      className={
                        "pl-1.5 leading-5.5 tracking-h2 text-primary  text-medium font-inter py-3.5"
                      }
                    >
                      {order?.trandate}
                    </td>
                    <td
                      className={
                        "pl-1.5 leading-5.5 tracking-h2 text-primary  text-medium font-inter py-3.5"
                      }
                    >
                      ${order?.amount}
                    </td>
                    <td
                      className={
                        "pl-1.5 leading-5.5 tracking-h2 text-primary  text-medium font-inter py-3.5"
                      }
                    >
                      {order?.statusref
                        ?.replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str: string) => str.toUpperCase())}
                    </td>
                    <td
                      className={
                        "pl-1.5 leading-5.5 tracking-h2 text-primary  text-medium font-inter py-3.5"
                      }
                    >
                      {getShippingAddress(order?.shipaddress)}
                    </td>
                    <td className={"py-3.5 text-brand"}>
                      {order?.custbody_anx_ko_b64_file && (
                        <>
                          <span
                            className={
                              "underline cursor-pointer text-brand leading-5.5 tracking-h2 text-medium font-inter"
                            }
                            onClick={() => {
                              let pdfWindow: any = window.open("");
                              pdfWindow.document.title = order?.entity;
                              pdfWindow.document.write(
                                "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                                  encodeURI(order?.custbody_anx_ko_b64_file) +
                                  "'></iframe>"
                              );
                            }}
                          >
                            PDF
                          </span>
                          <span className={"mx-1"}>/</span>
                        </>
                      )}
                      {order?.custbody_anx_ko_csv_file && (
                        <span
                          onClick={() =>
                            processAndDownloadCsvData(
                              order.custbody_anx_ko_csv_file
                            )
                          }
                          className={
                            "underline cursor-pointer  leading-5.5 tracking-h2 text-medium font-inter"
                          }
                        >
                          CSV
                        </span>
                      )}
                    </td>
                    <td
                      className={
                        "break-normal pl-1.5 underline cursor-pointer text-brand leading-5.5 tracking-h2 text-medium font-inter  py-3.5 text-right"
                      }
                    >
                      {!!order?.trackingnumbers?.length &&
                        order?.trackingnumbers
                          ?.filter((i: string) => i)
                          .map((i: any) => {
                            return (
                              <a
                                key={i}
                                target="_blank"
                                className="block"
                                href={`${ORDER_TRACKING_URL}/${i}`}
                                rel="noopener noreferrer"
                              >
                                Track Order
                              </a>
                            );
                          })}
                    </td>
                  </tr>
                );
              })}
        </table>
        {!isLoaded && !error && (
          <div className="m-3 text-center">
            <LoadingDots></LoadingDots>
          </div>
        )}
        {error && (
          <div className="m-3">
            <Error message={error}></Error>
          </div>
        )}
        {isLoaded && !error && !orders?.total && !isLoading && (
          <div className="m-3 text-center">
            We have no orders in the system for you.
          </div>
        )}
        {orders?.data?.length > orders?.limit && (
          <div className={"justify-center items-center flex my-6"}>
            <ReactPaginate
              previousClassName={"hidden"}
              nextClassName={"hidden"}
              className={"flex"}
              breakLabel="..."
              activeClassName={"border-2 border-base"}
              pageLinkClassName={"w-12 h-12 flex items-center justify-center "}
              pageClassName={"bg-accents-1 mr-3"}
              breakClassName={"px-5 py-3  mr-3"}
              onPageChange={({ selected }) => {
                setOrders({
                  ...orders,
                  offset: !selected ? 0 : selected * orders.limit,
                });
              }}
              pageRangeDisplayed={1}
              pageCount={orders.total / orders.limit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { DesktopView };
