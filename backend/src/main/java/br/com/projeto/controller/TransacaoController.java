package br.com.projeto.controller;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import br.com.projeto.model.Transacao;
import br.com.projeto.service.TransacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transacoes")
public class TransacaoController {

    private final TransacaoService transacaoService;

    public TransacaoController(TransacaoService transacaoService) {
        this.transacaoService = transacaoService;
    }

    @GetMapping
    public List<Transacao> listar(
            @RequestParam(name = "busca", required = false) String busca,
            @RequestParam(name = "campo", required = false, defaultValue = "data") String campo,
            @RequestParam(name = "direcao", required = false, defaultValue = "desc") String direcao) {
        if (busca != null && !busca.trim().isEmpty()) {
            return transacaoService.buscarPorDescricao(busca, campo, direcao);
        }
        return transacaoService.listarTodas(campo, direcao);
    }

    @GetMapping("/{id}")
    public Transacao buscarPorId(@PathVariable Long id) {
        return transacaoService.buscarPorId(id);
    }

    @GetMapping("/resumo")
    public Map<String, BigDecimal> resumo() {
        Map<String, BigDecimal> resumo = new LinkedHashMap<>();
        resumo.put("totalReceitas", transacaoService.calcularTotalReceitas());
        resumo.put("totalDespesas", transacaoService.calcularTotalDespesas());
        resumo.put("saldo", transacaoService.calcularSaldo());
        return resumo;
    }

    @PostMapping
    public ResponseEntity<Transacao> criar(@Valid @RequestBody Transacao transacao) {
        Transacao salva = transacaoService.salvar(transacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transacao> atualizar(@PathVariable Long id, @Valid @RequestBody Transacao transacao) {
        Transacao atualizada = transacaoService.atualizar(id, transacao);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        transacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
