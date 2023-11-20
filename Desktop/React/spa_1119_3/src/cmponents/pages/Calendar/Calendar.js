import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { format, addMonths, subMonths} from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays} from 'date-fns';
import "./_style.scss";
import Modal from './Modal/Modal';

const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
    return (
        <div className="header row">
            <div className="col col-start">
                <b>
                <span className="text">
                    <span className="text month">
                        {format(currentMonth, 'M월')}
                    </span>
                    {format(currentMonth, 'yyyy년')}
                </span>
                </b>
            </div>
            <div className="col col-end">
                <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth} />
                <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth} />
            </div>
        </div>
    );
};

const RenderDays = () => {
    const days = [];
    const date = ['Sun', 'Mon', 'Thu', 'Wed', 'Thrs', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
        days.push(
            <div className="col" key={i}>
                {date[i]}
            </div>,
        );
    }

    return <div className="days row">{days}</div>;
};

const RenderCells = ({ currentMonth, selectedDate, onDateClick }) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    const readWorkValues = (date) => {
        const currentDateKey = getDateKey(date);
        const savedWorkValues = JSON.parse(localStorage.getItem(currentDateKey)) || [];
        return savedWorkValues;
    };

    const calculateWage = (workEntries) => {
        let totalWage = 0;

        workEntries.forEach((workEntry) => {
            const startTime = new Date(`2000-01-01T${workEntry.workStartTime}`);
            const endTime = new Date(`2000-01-01T${workEntry.workEndTime}`);
            const timeDifference = endTime - startTime;
            const wage = (timeDifference / 3600000) * workEntry.inputAsset; // Calculate individual wage
            totalWage += parseFloat(wage.toFixed(2)); // Add to total wage
        });
        if(totalWage === 0) return '';
        else return totalWage.toFixed(0);
    };

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');
            const cloneDay = day;
            const isoDate = cloneDay.toISOString().split('T')[0];
            const yearMonthDay = isoDate.split('-').map(Number);

            const expenditure = `expenditure ${yearMonthDay[0]}-${yearMonthDay[1]}-${yearMonthDay[2] + 1}`;
            const expenditureMoney = parseFloat(localStorage.getItem(expenditure)) || '';

            const incomeAsset = `income ${yearMonthDay[0]}-${yearMonthDay[1]}-${yearMonthDay[2] + 1}`;
            const incomeSavedMoney = parseFloat(localStorage.getItem(incomeAsset)) || '';

            const savedWorkValues = readWorkValues(day);


            days.push(
                <div
                    className={`col cell ${
                        !isSameMonth(day, monthStart)
                            ? 'disabled'
                            : isSameDay(day, new Date())
                                ? 'selected'
                                : isSameDay(day, new Date())
                                    ? 'today'
                                    : format(currentMonth, 'M') !== format(day, 'M')
                                        ? 'not-valid'
                                        : 'valid'
                    }`}
                    key={day}
                    onClick={() => onDateClick(new Date(yearMonthDay[0], yearMonthDay[1] - 1, yearMonthDay[2] + 1))}
                >
                    <span
                        className={format(currentMonth, 'M') !== format(day, 'M') ? 'text not-valid' : ''}
                    >
                        {formattedDate}
                    </span>

                    <div className='value-container'>
                    <span className='workvalue'> {calculateWage(savedWorkValues) > 0 ? `+${calculateWage(savedWorkValues)}`: calculateWage(savedWorkValues)} </span>

            {incomeSavedMoney !== 0 && (
                <span className='incomevalue'>{incomeSavedMoney > 0 ? `+${incomeSavedMoney}` : incomeSavedMoney}</span>
            )}

            {expenditureMoney !== 0 && (
                <span className='expenditurevalue'>{expenditureMoney}</span>
            )}
        </div>
                </div>,
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="row" key={day}>
                {days}
            </div>,
        );
        days = [];
    }
    return <div className="body">{rows}</div>;
};

export const Calender = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [openModal, setOpenModal] = useState(false)

    const closeModal = () => {
        setOpenModal(false);
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };
    const onDateClick = (day) => {
        setSelectedDate(day);
        console.log(`${day}`);
        setOpenModal(true);
    };

    return (
        <div className="calendar">
            <RenderHeader
                currentMonth={currentMonth}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
                />
            <RenderDays />
            <RenderCells
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onDateClick={onDateClick}
            />
            {openModal && <Modal isOpen={openModal} closeModal={closeModal} selectedDate={selectedDate} />}
        </div>
    );
};
