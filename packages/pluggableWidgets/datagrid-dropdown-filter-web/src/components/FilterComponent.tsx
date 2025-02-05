import { createElement, Fragment, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "@mendix/piw-utils-internal";
import classNames from "classnames";
import deepEqual from "deep-equal";

export interface FilterOption {
    caption: string;
    value: string;
}

interface FilterComponentProps {
    ariaLabel?: string;
    emptyOptionCaption?: string;
    multiSelect?: boolean;
    name?: string;
    options: FilterOption[];
    tabIndex?: number;
    defaultValue?: string;
    updateFilters?: (values: FilterOption[]) => void;
}

export function FilterComponent(props: FilterComponentProps): ReactElement {
    const [valueInput, setValueInput] = useState("");
    const [options, setOptions] = useState<FilterOption[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);
    const [show, setShow] = useState(false);
    const [dropdownWidth, setDropdownWidth] = useState(0);
    const defaultValuesLoaded = useRef<boolean>(false);

    const componentRef = useRef<HTMLDivElement>(null);

    const setMultiSelectFilters = useCallback(
        (selectedOptions: FilterOption[]) => {
            if (selectedOptions?.length === 0) {
                setValueInput(props.emptyOptionCaption ?? "");
                setSelectedFilters([]);
            } else {
                setValueInput(selectedOptions.map(option => option.caption).join(","));
                setSelectedFilters(prev => {
                    if (deepEqual(selectedOptions, prev, { strict: true })) {
                        return prev;
                    }
                    return selectedOptions;
                });
            }
        },
        [props.emptyOptionCaption]
    );

    const onClick = useCallback(
        (option: FilterOption) => {
            if (props.multiSelect) {
                setMultiSelectFilters(toggleFilter(selectedFilters, option));
            } else {
                setValueInput(option.caption);
                setSelectedFilters([option]);
                setShow(false);
            }
        },
        [selectedFilters, props.multiSelect]
    );

    useOnClickOutside(componentRef, () => setShow(false));

    // Select the first option Or default option on load
    useEffect(() => {
        if (!defaultValuesLoaded.current && options.length > 0) {
            if (props.multiSelect) {
                if (props.defaultValue) {
                    const initialOptions = props.defaultValue
                        .split(",")
                        .map(value => options.find(option => option.value === value))
                        .filter(Boolean) as FilterOption[];

                    // User can set anything, but it could not match so we have to set to empty or ""
                    setMultiSelectFilters(initialOptions);
                } else {
                    setValueInput(props.emptyOptionCaption ?? "");
                }
            } else {
                // We want to add empty option caption
                const initialOption = options.find(option => option.value === props.defaultValue) ?? options[0];

                setValueInput(initialOption?.caption ?? "");
                setSelectedFilters(prev => {
                    const newValue = [initialOption];
                    if (deepEqual(newValue, prev, { strict: true })) {
                        return prev;
                    }
                    return newValue;
                });
            }
            defaultValuesLoaded.current = true;
        }
    }, [props.defaultValue, props.emptyOptionCaption, props.multiSelect, options]);

    useEffect(() => {
        const emptyOption = props.multiSelect
            ? []
            : [
                  {
                      caption: props.emptyOptionCaption ?? "",
                      value: ""
                  }
              ];
        const options = [...emptyOption, ...props.options];
        setOptions(prev => {
            if (deepEqual(prev, options, { strict: true })) {
                return prev;
            }
            return options;
        });

        // Resets the option to reload default values
        defaultValuesLoaded.current = false;
    }, [props.emptyOptionCaption, props.multiSelect, props.options, props.defaultValue]);

    useEffect(() => {
        props.updateFilters?.(selectedFilters);
    }, [selectedFilters]);

    const showPlaceholder = selectedFilters.length === 0 || valueInput === props.emptyOptionCaption;

    return (
        <div className="dropdown-container" data-focusindex={props.tabIndex ?? 0} ref={componentRef}>
            <input
                value={!showPlaceholder ? valueInput : ""}
                placeholder={showPlaceholder ? props.emptyOptionCaption : undefined}
                className="form-control dropdown-triggerer"
                onClick={() => setShow(true)}
                onFocus={() => setShow(true)}
                aria-haspopup
                ref={inputRef => {
                    if (inputRef && inputRef.clientWidth) {
                        setDropdownWidth(inputRef.clientWidth);
                    }
                }}
                aria-expanded={show}
                aria-controls={`${props.name}-dropdown-list`}
                aria-label={props.ariaLabel}
            />
            {show && (
                <ul
                    id={`${props.name}-dropdown-list`}
                    className="dropdown-list"
                    style={{ width: dropdownWidth }}
                    role="menu"
                    data-focusindex={0}
                >
                    {options.map((option, index) => (
                        <li
                            className={classNames({
                                "filter-selected": !props.multiSelect && selectedFilters.includes(option)
                            })}
                            key={index}
                            onClick={() => onClick(option)}
                            onKeyDown={e => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    onClick(option);
                                }
                            }}
                            role="menuitem"
                            tabIndex={0}
                        >
                            {props.multiSelect ? (
                                <Fragment>
                                    <input
                                        id={`${props.name}_checkbox_toggle_${index}`}
                                        type="checkbox"
                                        checked={selectedFilters.includes(option)}
                                    />
                                    <label
                                        htmlFor={`${props.name}_checkbox_toggle_${index}`}
                                        style={{ pointerEvents: "none" }}
                                    >
                                        {option.caption}
                                    </label>
                                </Fragment>
                            ) : (
                                <div className="filter-label">{option.caption}</div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function toggleFilter(filters: FilterOption[], filterToToggle: FilterOption): FilterOption[] {
    const alteredFilters = [...filters];
    const index = filters.indexOf(filterToToggle);
    if (index > -1) {
        alteredFilters.splice(index, 1);
    } else {
        alteredFilters.push(filterToToggle);
    }

    return alteredFilters;
}
