import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";
import { Messages as MessagesType } from "primereact/messages";

import './Home.css';

interface Country {
    name: string;
    code: string;
}

interface ErrorState {
    firstName: boolean;
    mobile: boolean;
    email: boolean;
    id: boolean;
}

const Home: React.FC = () => {
    const navigate = useNavigate();
    const msgs = useRef<MessagesType>(null);

    // Form states
    const [id, setId] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [skills, setSkills] = useState<string[]>([]);
    const [address, setAddress] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [mobile, setMobile] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [errors, setErrors] = useState<ErrorState>({
        firstName: false,
        mobile: false,
        email: false,
        id: false
    });

    const countries: Country[] = [
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' }
    ];

    const onSkillsChange = (e: CheckboxChangeEvent) => {
        const value = e.value;
        const checked = e.checked;

        let updatedSkills = [...skills];
        if (checked) {
            updatedSkills.push(value);
        } else {
            updatedSkills = updatedSkills.filter(skill => skill !== value);
        }
        setSkills(updatedSkills);
    };

    const selectedCountryTemplate = (option: Country | undefined, props: any) => {
        return option ? <div className="flex align-items-center">{option.name}</div> : <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option: Country) => (
        <div className="flex align-items-center">{option.name}</div>
    );

    const handleSave = () => {
        const newErrors: ErrorState = {
            firstName: firstName.trim() === '',
            mobile: mobile.trim() === '',
            email: email.trim() === '',
            id: id.trim() === ''
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some(err => err === true);
        if (hasError) {
            msgs.current?.show([
                { sticky: true, severity: 'error', summary: 'Please Fill All Required Fields' }
            ]);
            return;
        }

        const formData = {
            id: 'SP-' + id,
            firstName,
            surname,
            gender,
            skills: skills.join(', '),
            address,
            country: selectedCountry?.name ?? '',
            mobileno: mobile,
            email
        };

        const existingData = JSON.parse(localStorage.getItem('userFormData') || '[]');
        const updatedData = [...existingData, formData];
        localStorage.setItem('userFormData', JSON.stringify(updatedData));

        navigate('./table');
    };

    const clear = () => {
        setId('');
        setFirstName('');
        setSurname('');
        setGender('');
        setSkills([]);
        setAddress('');
        setSelectedCountry(null);
        setMobile('');
        setEmail('');
        setErrors({
            firstName: false,
            mobile: false,
            email: false,
            id: false
        });
        msgs.current?.clear();
    };

    return (
        <>
            <Messages ref={msgs} />
            <div className="grid justify-content-center mx-2">
                <div className="col-12 md:col-10 lg:col-8 xl:col-6">
                    <div className="p-4 content-div">

                        {/* ID */}
                        <div className="grid mb-3">
                            <div className="col-12">
                                <label htmlFor="id">ID {errors.id && <span className="text-danger">*</span>}</label>
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">SP-</span>
                                    <InputText id="id" className="w-full" value={id} onChange={(e) => setId(e.target.value)} placeholder="001" />
                                </div>
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div className="grid mb-3">
                            <div className="col-12 md:col-6">
                                <label htmlFor="FirstName">First Name {errors.firstName && <span className="text-danger">*</span>}</label>
                                <InputText id="FirstName" className="w-full" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="col-12 md:col-6">
                                <label htmlFor="Surname">Surname</label>
                                <InputText id="Surname" className="w-full" value={surname} onChange={(e) => setSurname(e.target.value)} />
                            </div>
                        </div>

                        {/* Gender and Skills */}
                        <div className="grid mb-3">
                            <div className="col-12 md:col-6">
                                <label className="block mb-2">Gender</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Male', 'Female', 'Other'].map((g) => (
                                        <div key={g} className="flex align-items-center">
                                            <RadioButton inputId={g} name="gender" value={g} onChange={(e: RadioButtonChangeEvent) => setGender(e.value)} checked={gender === g} />
                                            <label htmlFor={g} className="ml-2">{g}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-12 md:col-6">
                                <label className="block mb-2">Skills</label>
                                <div className="flex flex-wrap gap-3">
                                    {['React', 'Java', 'Android', 'CSS'].map((skill) => (
                                        <div key={skill} className="flex align-items-center">
                                            <Checkbox
                                                inputId={skill}
                                                name="skills"
                                                value={skill}
                                                onChange={onSkillsChange}
                                                checked={skills.includes(skill)}
                                            />
                                            <label htmlFor={skill} className="ml-2">{skill}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Address */}
                        <div className="mb-3">
                            <label className="block mb-2">Address</label>
                            <InputTextarea rows={4} className="w-full" placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>

                        {/* Country Dropdown */}
                        <div className="mb-3">
                            <Dropdown
                                value={selectedCountry}
                                onChange={(e: DropdownChangeEvent) => setSelectedCountry(e.value)}
                                options={countries}
                                optionLabel="name"
                                placeholder="Select a Country"
                                filter
                                valueTemplate={selectedCountryTemplate}
                                itemTemplate={countryOptionTemplate}
                                className="w-full"
                            />
                        </div>

                        {/* Mobile and Email */}
                        <div className="grid mb-3">
                            <div className="col-12 md:col-6">
                                <label htmlFor="mobileno">Mobile No. {errors.mobile && <span className="text-danger">*</span>}</label>
                                <InputText id="mobileno" className="w-full" placeholder="9054185855" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                            </div>
                            <div className="col-12 md:col-6">
                                <label htmlFor="email">Email {errors.email && <span className="text-danger">*</span>}</label>
                                <InputText id="email" className="w-full" placeholder="abc@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="grid">
                            <div className="col-12 flex justify-content-center gap-3">
                                <Button label="Save" severity="success" text raised onClick={handleSave} />
                                <Button label="Clear" severity="warning" text raised onClick={clear} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
