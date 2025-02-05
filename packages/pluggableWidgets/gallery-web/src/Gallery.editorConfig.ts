import {
    DropZoneProps,
    hidePropertyIn,
    Problem,
    Properties,
    RowLayoutProps,
    StructurePreviewProps,
    transformGroupsIntoTabs
} from "@mendix/piw-utils-internal";
import { GalleryPreviewProps } from "../typings/GalleryProps";

export function getProperties(
    values: GalleryPreviewProps,
    defaultProperties: Properties,
    platform: "web" | "desktop"
): Properties {
    if (values.pagination !== "buttons") {
        hidePropertyIn(defaultProperties, values, "pagingPosition");
    }

    if (values.showEmptyPlaceholder === "none") {
        hidePropertyIn(defaultProperties, values, "emptyPlaceholder");
    }

    if (values.filterList?.length === 0) {
        hidePropertyIn(defaultProperties, values, "filtersPlaceholder");
    }

    if (platform === "web") {
        transformGroupsIntoTabs(defaultProperties);
    }
    return defaultProperties;
}

export function check(values: GalleryPreviewProps): Problem[] {
    const errors: Problem[] = [];
    if (!values.desktopItems || values.desktopItems < 1 || values.desktopItems > 12) {
        errors.push({
            property: "desktopItems",
            message: "Desktop items must be a number between 1 and 12"
        });
    }
    if (!values.phoneItems || values.phoneItems < 1 || values.phoneItems > 12) {
        errors.push({
            property: "phoneItems",
            message: "Phone items must be a number between 1 and 12"
        });
    }
    if (!values.tabletItems || values.tabletItems < 1 || values.tabletItems > 12) {
        errors.push({
            property: "tabletItems",
            message: "Tablet items must be a number between 1 and 12"
        });
    }
    return errors;
}

export function getPreview(values: GalleryPreviewProps): StructurePreviewProps {
    const filterCaption =
        values.filterList.length > 0
            ? values.sortList.length > 0
                ? "Place filter/sort widget(s) here"
                : "Place filter widget(s) here"
            : values.sortList.length > 0
            ? "Place sort widget(s) here"
            : "Place widget(s) here";
    const titleHeader: RowLayoutProps = {
        type: "RowLayout",
        columnSize: "fixed",
        backgroundColor: "#daeffb",
        borders: true,
        borderWidth: 1,
        children: [
            {
                type: "Container",
                padding: 4,
                children: [
                    {
                        type: "Text",
                        content: "Gallery",
                        fontColor: "#2074c8"
                    }
                ]
            }
        ]
    };
    const filters = {
        type: "RowLayout",
        columnSize: "fixed",
        borders: true,
        children: [
            {
                type: "DropZone",
                property: values.filtersPlaceholder,
                placeholder: filterCaption
            } as DropZoneProps
        ]
    } as RowLayoutProps;

    const content = {
        type: "RowLayout",
        columnSize: "fixed",
        borders: true,
        children: [
            {
                type: "DropZone",
                property: values.content,
                placeholder: "Place widgets here"
            } as DropZoneProps
        ]
    } as RowLayoutProps;
    return {
        type: "Container",
        children: [titleHeader, ...(values.filterList.length > 0 ? [filters] : []), content]
    };
}
