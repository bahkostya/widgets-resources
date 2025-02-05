import { Alert, FilterContextValue, ListAttributeValueBuilder } from "@mendix/piw-utils-internal";
import { mount } from "enzyme";
import { createContext, createElement } from "react";
import DatagridNumberFilter from "../../DatagridNumberFilter";

const commonProps = {
    class: "filter-test",
    tabIndex: 0,
    name: "filter-test",
    defaultFilter: "equal" as const,
    adjustable: true,
    delay: 1000
};

const mxObject = {
    session: {
        getConfig: () => ({
            locale: {
                languageTag: "en-US",
                patterns: {
                    date: "dd/MM/YYYY"
                }
            }
        })
    }
};

describe("Number Filter", () => {
    describe("with single attribute", () => {
        beforeAll(() => {
            (window as any)["com.mendix.widgets.web.filterable.filterContext"] = createContext({
                filterDispatcher: jest.fn(),
                singleAttribute: new ListAttributeValueBuilder().withType("Long").withFilterable(true).build()
            } as FilterContextValue);
            (window as any).mx = mxObject;
        });

        it("renders correctly", () => {
            const filter = mount(<DatagridNumberFilter {...commonProps} />);

            expect(filter).toMatchSnapshot();
        });

        afterAll(() => {
            (window as any)["com.mendix.widgets.web.filterable.filterContext"] = undefined;
        });
    });

    describe("with multiple attributes", () => {
        beforeAll(() => {
            (window as any)["com.mendix.widgets.web.filterable.filterContext"] = createContext({
                filterDispatcher: jest.fn(),
                multipleAttributes: {
                    attribute1: new ListAttributeValueBuilder()
                        .withId("attribute1")
                        .withType("Long")
                        .withFilterable(true)
                        .build(),
                    attribute2: new ListAttributeValueBuilder()
                        .withId("attribute2")
                        .withType("Decimal")
                        .withFilterable(true)
                        .build()
                }
            } as FilterContextValue);
            (window as any).mx = mxObject;
        });

        it("renders correctly", () => {
            const filter = mount(<DatagridNumberFilter {...commonProps} />);

            expect(filter).toMatchSnapshot();
        });

        afterAll(() => {
            (window as any)["com.mendix.widgets.web.filterable.filterContext"] = undefined;
        });
    });

    describe("with wrong attribute's type", () => {
        beforeAll(() => {
            (window as any)["com.mendix.widgets.web.filterable.filterContext"] = createContext({
                filterDispatcher: jest.fn(),
                singleAttribute: new ListAttributeValueBuilder().withType("Boolean").withFilterable(true).build()
            } as FilterContextValue);
            (window as any).mx = mxObject;
        });

        it("renders error message", () => {
            const filter = mount(<DatagridNumberFilter {...commonProps} />);

            expect(filter.find(Alert).text()).toBe(
                "The attribute type being used for Number filter is not 'Auto number, Decimal, Integer or Long'"
            );
        });

        afterAll(() => {
            (window as any)["com.mendix.widgets.web.filterable.filterContext"] = undefined;
        });
    });

    describe("with wrong multiple attributes' types", () => {
        beforeAll(() => {
            (window as any)["com.mendix.widgets.web.filterable.filterContext"] = createContext({
                filterDispatcher: jest.fn(),
                multipleAttributes: {
                    attribute1: new ListAttributeValueBuilder()
                        .withId("attribute1")
                        .withType("String")
                        .withFilterable(true)
                        .build(),
                    attribute2: new ListAttributeValueBuilder()
                        .withId("attribute2")
                        .withType("HashString")
                        .withFilterable(true)
                        .build()
                }
            } as FilterContextValue);
            (window as any).mx = mxObject;
        });

        it("renders error message", () => {
            const filter = mount(<DatagridNumberFilter {...commonProps} />);

            expect(filter.find(Alert).text()).toBe(
                'To use multiple filters you need to define a filter identification in the properties of Number filter or have a "Auto number, Decimal, Integer or Long" attribute available.'
            );
        });

        afterAll(() => {
            (window as any)["com.mendix.widgets.web.filterable.filterContext"] = undefined;
        });
    });

    describe("with no context", () => {
        beforeAll(() => {
            (window as any)["com.mendix.widgets.web.filterable.filterContext"] = undefined;
            (window as any).mx = mxObject;
        });

        it("renders error message", () => {
            const filter = mount(<DatagridNumberFilter {...commonProps} />);

            expect(filter.find(Alert).text()).toBe(
                "The Number filter widget must be placed inside the header of the Data grid 2.0 or Gallery widget."
            );
        });
    });
});
