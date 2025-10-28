import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tooltip } from 'primereact/tooltip'; 
import { Toast } from 'primereact/toast';
import Header from "../components/Header";
import Listagem from "../components/Listagem";
import Modal from "../components/Modal";
import { useNavigate } from 'react-router-dom'; 
import apiVestibulizeClient, { traitExpiredToken } from "../utils/apiVestibulizeClient";
import Navbar from "../components/Navbar";

const Caderno = () => {

    const navigate = useNavigate();
    const toast = useRef(null);

    const [filtro, setFiltro] = useState("");
    const [cadernos, setCadernos] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCaderno, setEditingCaderno] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingCaderno, setViewingCaderno] = useState(null);

    useEffect(() => {
        getCadernos();
    }, []);

    const getCadernos = async () => {
        const params = filtro.trim().length > 3 ? { search: filtro.trim() } : {};

        const response = await apiVestibulizeClient.get('notebook', { 
            headers: {
                token: `${localStorage.getItem('token')}` 
            },
            params: params
        }).catch(error => {
            console.log(error.response.data.message);
            traitExpiredToken(error.response.data.message);
        });
        
        setCadernos(response.data.map((item) => ({
            data: item.created_at === null ? null : new Date(item.created_at).toLocaleDateString("pt-BR"),
            titulo: item.title,
            id: item.id
        })))
    }

    const handleOpenModal = (item = null) => {
        setIsViewModalOpen(false);
        setEditingCaderno(item);
        setTitulo(item ? item.titulo : "");
        setDescricao(item ? item.descricao : "");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCaderno(null);
        setTitulo("");
        setDescricao("");
    };
    
    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingCaderno(null);
    }

    const handleSave = async () => {
        if (!titulo.trim()) {
            toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'O título é obrigatório!', life: 3000 });
            return;
        }

        const dados = {
            id: editingCaderno ? editingCaderno.id : null,
            title: titulo,
            description: descricao,
        };

        if (editingCaderno) {
            apiVestibulizeClient.put('notebook/' + dados.id, dados, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(response => {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Caderno atualizado com sucesso!', life: 3000 });
                getCadernos();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar caderno. Tente novamente.', life: 3000 });
            }).finally(() => {
                handleCloseModal();
            });
        } else {
            apiVestibulizeClient.post('notebook', dados, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(response => {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Caderno criado com sucesso!', life: 3000 });
                getCadernos();
            }).catch(error => {
                traitExpiredToken(error.response.data.message);
                console.error(error);
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar caderno. Tente novamente.', life: 3000 });
            }).finally(() => {
                handleCloseModal();
            });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Tem certeza que deseja excluir este caderno?")) {
            apiVestibulizeClient.delete('notebook/' + id, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(response => {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Caderno excluído com sucesso!', life: 3000 });
                getCadernos();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir caderno. Tente novamente.', life: 3000 });
            });
        }
    };

    const formStyles = {
        input: {
            width: '100%',
            borderRadius: '8px',
            backgroundColor: '#2e2e42',
            border: '1px solid #4a4a60',
            color: '#e0e0e0',
            padding: '12px 15px',
        },
        button: {
            width: '100%',
            padding: '12px 0',
            borderRadius: '8px',
            backgroundColor: '#46397d',
            border: 'none',
            color: '#e0e0e0',
            marginTop: '15px',
            fontWeight: 'bold',
            letterSpacing: '1px',
        },
    };

    const iconStyle = {
        marginLeft: '8px',
        color: '#977acfff',
        cursor: 'help',
        fontSize: '0.7em',
    };

    const modalFormJSX = (
        <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            style={{ display: "flex", flexDirection: "column" }}
        >
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="titulo" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Título</label>
                    <i id="tooltip-icon-titulo" className="pi pi-info-circle" style={iconStyle} />
                    <Tooltip 
                        target="#tooltip-icon-titulo" 
                        content="Aqui você deve inserir o título de seu caderno." 
                        position="top" 
                    />
                </div>
                <InputText
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    style={formStyles.input}
                    autoFocus
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="descricao" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Descrição</label>
                    <i id="tooltip-icon-descricao" className="pi pi-info-circle" style={iconStyle} />
                    <Tooltip 
                        target="#tooltip-icon-descricao" 
                        content="Aqui você deve inserir uma breve descrição de seu caderno." 
                        position="top" 
                    />
                </div>
                <InputText
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    style={formStyles.input}
                    autoFocus
                />
            </div>

            <Button
                label={editingCaderno ? "ATUALIZAR" : "ADICIONAR"}
                style={formStyles.button}
            />
        </form>
    );

    const viewModalJSX = viewingCaderno && (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            color: '#e0e0e0'
        }}>
            <p style={{ margin: 0, fontSize: '1em', color: '#c0c0c0' }}>
                Data: {viewingCaderno.data}
            </p>
            <div style={{ 
                backgroundColor: '#2e2e42', 
                borderRadius: '8px', 
                padding: '15px', 
                border: '1px solid #4a4a60',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
            }}>
                {viewingCaderno.descricao}
            </div>
        </div>
    );

    const createCardActionsGenerator = (caderno) => (
        <>
            <Button 
                icon="pi pi-pencil" 
                className="p-button-text p-button-sm" 
                style={{ color: '#ffbc3fff' }} 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    handleOpenModal(caderno); 
                }} 
            />
            <Button 
                icon="pi pi-trash" 
                className="p-button-text p-button-sm" 
                style={{ color: '#e05a2eff' }} 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDelete(caderno.id); 
                }} 
            />
        </>
    );

    const handleFilterSearch = (e) => {
        setFiltro(e.target.value);

        if(e.target.value.length > 3) {
            getCadernos();
        }
    }

    return (
        <main style={{ background: 'linear-gradient(180deg, #F9F9F9 0%, #E6E9F0 100%)', minHeight: '100vh', width: '100%' }}>
            <Navbar />
            <Toast ref={toast} position="bottom-right"/>

            <Header
                title="Cadernos"
                searchText={filtro}
                onSearchChange={(e) => handleFilterSearch(e)}
                onAddClick={() => handleOpenModal()}
                searchPlaceholder="Pesquisar por título."
                addButtonLabel="Adicionar Caderno"
            />

            <section style={{ padding: "0 20px", maxWidth: "1000px", margin: "30px auto" }}>
                <Listagem
                    listagem={cadernos}
                    headerTitle="Título/Data"
                    headerActions="Ações"
                    cardActionsGenerator={createCardActionsGenerator}
                    onCardClick={(a) => { navigate(`/caderno/${a.id}/anotacoes`) }} 
                />
            </section>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingCaderno ? "Atualizar - Caderno" : "Adicionar - Caderno"}
            >
                {modalFormJSX}
            </Modal>

            <Modal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                title={viewingCaderno ? `Visualizar - ${viewingCaderno.titulo}` : "Visualizar Caderno"}
            >
                {viewModalJSX}
            </Modal>
        </main>
    );
};

export default Caderno;
